## Oauth Email Wallet Demo

Authorize scoped access to your email wallet account controlled by ZK Email proofs, via just 3 lines of code in a frontend SDK. This demo site shows how to integrate it with a live deployed example.

## Installation
```
npm install @zk-email/oauth-sdk
```

## Usage

To learn more about how to integrate, check out [our OAuth docs](https://zkemail.gitbook.io/zk-email/login-with-zk-email-oauth-api).

## Link ts-sdk

```
git clone git@github.com:zkemail/email-wallet.git
cd email-wallet
git checkout feat/oauth-mvp
cd email-wallet/packages/ts-sdk
npm link

cd {THIS_REPO}
npm link @zk-email/ts-sdk
```
