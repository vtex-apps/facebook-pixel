import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Helmet, withRuntimeContext } from 'render'
import { Pixel } from 'vtex.store/PixelContext'

import { fbjs, noScript } from './scripts/fbjs'
import { formatSearchResultProducts, getProductPrice } from './utils/formatHelper'

const APP_LOCATOR = 'vtex.facebook-pixel'

interface Props {
  subscribe: (s: any) => () => void
  runtime: {
    workspace: string
    account: string
    culture: {
      currency: string
    }
  }
}

/**
 * Component that encapsulates the communication
 * with the Facebook Pixel API, and listens for the
 * events emitted by the store through the Pixel HOC.
 */
class FacebookPixel extends Component<Props> {
  public static propTypes = {
    runtime: PropTypes.shape({
      account: PropTypes.string,
      culture: PropTypes.shape({
        currency: PropTypes.string,
      }),
      workspace: PropTypes.string,
    }),
    subscribe: PropTypes.func,
  }

  public static contextTypes = {
    getSettings: PropTypes.func.isRequired,
  }

  private unsubscribe: () => void

  constructor(props: Props) {
    super(props)
    this.unsubscribe = props.subscribe(this)
  }

  public shouldComponentUpdate() {
    // the component should only be rendered once
    return false
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  get pixelId() {
    const { pixelId } = this.context.getSettings(APP_LOCATOR) || { pixelId: undefined }

    return pixelId
  }

  get currency() {
    return this.props.runtime.culture.currency
  }

  public componentDidMount() {
    if (!this.pixelId) {
      const { runtime: { workspace, account } } = this.props
      console.warn(
        `Warning: No FB Pixel ID is defined. To setup the app, take a look at https://${workspace}--${account}.myvtex.com/admin/apps/`
      )
    }
  }

  public trackCategoryPage(page: string) {
    return (data: any) => {
      fbq('track', 'ViewContent', {
        ...formatSearchResultProducts(data.products),
        content_category: page,
        content_type: 'product_group',
        currency: this.currency,
      })
    }
  }

  /* tslint:disable member-ordering */
  public departmentView = this.trackCategoryPage('department')

  public categoryView = this.trackCategoryPage('category')
  /* tslint:enable member-ordering */

  public internalSiteSearchView = (data: any) => {
    fbq('track', 'Search', formatSearchResultProducts(data.products))
  }

  public productView = (data: any) => {
    const { product: { productName, productId } } = data

    fbq('track', 'ViewContent', {
      content_category: 'product',
      content_ids: [productId],
      content_name: name,
      content_type: 'product',
      currency: this.currency,
      value: getProductPrice(data.product),
    })
  }

  public render() {
    const pixelId = this.pixelId

    if (!pixelId) {
      return null
    }

    const scripts = [{
      innerHTML: fbjs(pixelId),
      type: 'application/javascript',
    }]
    const noScripts = [{
      id: 'fbjs_frame',
      innerHTML: noScript(pixelId),
    }]

    return <Helmet script={scripts} noscript={noScripts} />
  }
}

export default Pixel(withRuntimeContext(FacebookPixel))
