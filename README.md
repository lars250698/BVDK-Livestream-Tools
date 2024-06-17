# BVDK Livestream Tools

This application provides a better way to control livestream assets for Powerlifting competitions
in the German IPF affiliate, the [BVDK](https://bvdk.de/).

## Prerequesites

Your competition needs to be run by the [BVDK Vereinsportal](https://bvdk.vportal-online.de/).
When hosting a competition via the Vereinsportal, you have to create a set of credentials with read-rights to the competition.

## Configuration

When starting the application, you will see some config options next to the login field.
Only change those options if you absolutely know what you are doing!

The options are:

- Vereinsportal URL (default https://bvdk.vportal-online.de). The Vereinsportal base URL. Only needs to be changed when used from a different country which also uses Vereinsportal for their competitions or when working on the staging environment.
- Login Proxy URL (default https://818wrx6ocb.execute-api.eu-central-1.amazonaws.com/default/vportal-auth-proxy). Since normal login attempts will be blocked by CORS, we need a proxy. A proxy for the german Vereinsportal affiliate is provided under the given link. Do not change this unless you have good reason to.
- API Port (default 8000). The port where the API is started.

## Customization

For docs on customizable stream assets, see [Custom Template Docs](docs/custom-templates.md)
