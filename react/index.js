/* global fbq */
/* eslint-disable camelcase */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet, withRuntimeContext } from 'render'
import { Pixel } from 'vtex.store/PixelContext'

import { formatSearchResultProducts } from './utils'
import { fbjs, noScript } from './scripts/fbjs'

const APP_LOCATOR = 'vtex.facebook-pixel'

class FacebookPixel extends Component {
  static propTypes = {
    subscribe: PropTypes.func,
    runtime: PropTypes.shape({
      workspace: PropTypes.string,
      account: PropTypes.string,
      culture: PropTypes.shape({
        currency: PropTypes.string,
      }),
    }),
  }

  static contextTypes = {
    getSettings: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.unsubscribe = props.subscribe(this)
  }

  shouldComponentUpdate() {
    // the component should only be rendered once
    return false
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  get pixelId() {
    const { pixelId } = this.context.getSettings(APP_LOCATOR) || {}

    return pixelId
  }

  get currency() {
    return this.props.runtime.culture.currency
  }

  componentDidMount() {
    if (!this.pixelId) {
      const { runtime: { workspace, account } } = this.props
      console.warn(
        `Warning: No pixel id is defined. To setup the app, take a look at https://${workspace}--${account}.myvtex.com/admin/apps/`
      )
    }
  }

  trackCategoryPage = page => data => {
    fbq('track', 'ViewContent', {
      ...formatSearchResultProducts(data.products),
      content_type: 'product_group',
      content_category: page,
      currency: this.currency,
    })
  }

  departmentView = this.trackCategoryPage('department')
  categoryView = this.trackCategoryPage('category')

  internalSiteSearchView = data => {
    fbq('track', 'Search', formatSearchResultProducts(data.products))
  }

  productView = data => {
    const { product: { name, category, id, price } } = data

    fbq('track', 'ViewContent', {
      content_ids: [id],
      content_name: name,
      content_type: 'product',
      value: parseFloat(price),
      content_category: category,
      currency: this.currency,
    })
  }

  render() {
    const pixelId = this.pixelId

    if (!pixelId) {
      return null
    }

    const scripts = [{
      type: 'application/javascript',
      innerHTML: fbjs(pixelId),
    }]
    const noScripts = [{
      id: 'fbjs_frame',
      innerHTML: noScript(pixelId),
    }]

    return <Helmet script={scripts} noscript={noScripts} />
  }
}

export default Pixel(withRuntimeContext(FacebookPixel))
