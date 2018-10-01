import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet, withRuntimeContext } from 'render'
import { Pixel } from 'vtex.store'

import { fbjs, noScript } from './scripts/fbjs'

const APP_LOCATOR = 'vtex.facebook-pixel'

class FacebookPixel extends Component {
  static propTypes = {
    subscribe: PropTypes.func,
    runtime: PropTypes.shape({
      workspace: PropTypes.string,
      account: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props)
    this.unsubscribe = props.subscribe(this)
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    const { pixelId } = this.context.getSettings(APP_LOCATOR) || {}

    if (!pixelId) {
      const { runtime: { workspace, account } } = this.props
      console.warn(
        `No pixel id is defined. Take a look at https://${workspace}--${account}.myvtex.com/admin/apps/${APP_LOCATOR}/setup`
      )

      return null
    }

    const scripts = [{
      type: 'application/javascript',
      innerHtml: fbjs(pixelId),
    }]
    const noScripts = [{
      id: 'fbjs_frame',
      innerHtml: noScript(pixelId),
    }]

    return <Helmet script={scripts} noscript={noScripts} />
  }
}

export default Pixel(withRuntimeContext(FacebookPixel))
