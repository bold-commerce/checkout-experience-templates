---
Using the Open Source Checkout Template
---

Bold provides an Open Source Checkout Template intended to help you build your own headless checkout powered by Bold APIs. This template provides an example of the standard Bold Checkout user interface, but it also enables you to access API libraries for easy customization of the user experience.

This document outlines the prerequisites and requirements of the Open Source Checkout Template and how to get it up and running.

## Prerequisites

1. Install Bold Checkout on a store and create an API access token in Bold Account Center. For instructions, refer to the [Checkout Getting Started](/guides/checkout/checkout-getting-started) guide.
1. Install the appropriate dependencies. The Open Source Checkout Template is built using the following series of libraries. Follow the instructions in each library's respective README to install and configure it:
    1. _Checkout Frontend Library_ — a JavaScript library that creates a structure for calling the Bold Checkout Frontend APIs. Note that this library calls only the [Checkout Frontend](/api/checkout) API.
    1. _Checkout Express Pay Library_ — a JavaScript library that adds support for Google Pay, Apple Pay, Link (from Stripe), and PayPal Express.

## Create a backend application

In order to host the Open Source Checkout Template, you must create a backend application to provide routing functionality, initialize and manage orders via the [Bold Checkout Backend](/api/orders), and host the checkout pages.

Bold does not currently provide a library for this functionality, so you must create the backend from scratch. The [Build a Headless Checkout](https://developer.staging.boldcommerce.com/default/guides/checkout/checkout-headless-guide#project-setup) page provides a basic outline of the steps required to set up a headless checkout backend.

## Set up the template

To execute the installation steps it is required to have **node** and **npm** previously installed.

From the root folder of this project do the follow:

* Install Checkout Experience Templates node_modules
```
npm install
```

* Build Checkout Experience Templates code
```
npm run build-dev
```
_Use `build-dev` for `development` mode javascript generation_

_Use `build` for `production` mode javascript generation_

* The templates generated can be found in:

`<path_to_project>/build`

---
Before you can view the template on your own site, you must complete a few additional steps.

### Create a div to load the template

First, you must create a `<div>` element with the ID `main` within the file that will initialize your template. The following code snippet shows an example:

```javascript
<div id="main">
    <!-- This div is where the app will run -->
</div>
```

### Define the browser Window object

The Open Source Checkout Template must also have access to the browser's [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object.

In particular, the template requires the following standard properties and methods for the Window object:

- [Window.location.href](https://developer.mozilla.org/en-US/docs/Web/API/Location/href)
- [Window.location.hostname](https://developer.mozilla.org/en-US/docs/Web/API/Location/hostname)
- [Window.location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname)
- [Window.history.replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
- [Window.innerWidth](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth)
- [Window.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [Window.removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
- [Window.scrollTo](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo)
- [Window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)

In addition, you must add and define certain custom properties that the template expects to use. The following table describes the properties and how they are used:

| Property                       | Type                                | Description                                                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Window.initialTimestamps`     | `IFrontEndEvent` or `string` object | Time stamps set to send event information to track speed.                                                                                                                                                                                                                                                                             |
| `Window.storeLoadTimesLocally` | `boolean`                           | Indicates whether to send event information used to track speed.                                                                                                                                                                                                                                                                      |
| `Window.environment`           | `IEnvironment`                      | A variable that sets the type of environment the app is running in order to call the correct Bold Checkout APIs. Possible values are `'production'` and `'development'`. For example: <br/> `Window.environment = {type: 'production'} `                                                                                              |
| `Window.bugsnagApiKey`         | `string`                            | (Optional) An API key Used to connect to [BugSnag](https://www.bugsnag.com/) to report errors as they occur.                                                                                                                                                                                                                          |
| `Window.customDomain`          | `string`                            | (Optional) A vanity override for the `Window.shopAlias` URL. Shown to the customer when they are on the checkout page.                                                                                                                                                                                                                |
| `Window.enableConsole`         | `boolean`                           | (Optional) Indicates whether to define and extra `console.error` that is printed to the console as errors happen.                                                                                                                                                                                                                     |
| `Window.shopIdentifier`        | `string`                            | The identifier of your store, retrieved from the [Get Info](/api/shops#operation/GetShopInfo) endpoint.                                                                                                                                                                                                                               |
| `Window.shopAlias`             | `string`                            | Used to create the URL to access the shop and to compose the URL to access the checkout page.                                                                                                                                                                                                                                         |
| `Window.shopName`              | `string`                            | The name of the store. You can display this on the checkout page.                                                                                                                                                                                                                                                                     |
| `Window.headerLogoUrl`         | `string`                            | (Optional) The URL of the image of the store's logo. You can display this on the Checkout page.                                                                                                                                                                                                                                       |
| `Window.returnUrl`             | `string`                            | The URL of the cart page. You can display this URL on the checkout page to allow the customer to return to the cart.                                                                                                                                                                                                                  |
| `Window.loginUrl`              | `string`                            | The URL of the store login page. You can display this URL on the checkout page to allow the customer to log in.                                                                                                                                                                                                                       |
| `Window.supportEmail`          | `string`                            | An email that a customer can use to contact the store. You can display this on the checkout page to allow the customer to contact support.                                                                                                                                                                                            |
| `Window.platformType`          | `string`                            | The platform the store uses. You can use this to compose the URL to load or redirect the checkout page.                                                                                                                                                                                                                               |
| `Window.publicOrderId`         | `string`                            | The public order ID that is generated when you initialize an order using the [Initialize Order](/api/orders#operation/post-init) endpoint.                                                                                                                                                                                            |
| `Window.initializedOrder`      | `string`                            | The application state of an order, returned from a call to the [Initialize Order](/api/orders#operation/post-init) endpoint. If the order is for an authenticated customer, you can use the [Add Authenticated Customer](/api/orders#operation/post-auth-customers) endpoint to initialize a checkout session with a logged-in order. |

## Customize your checkout

Once your own version of the Open Source Checkout Template is up and running, you can make changes to the store's user interface and otherwise customize it in any number of ways.
