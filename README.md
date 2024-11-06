# SAP BTP Certificate Authentication Example

This repository demonstrates how to authenticate to SAP Business Technology Platform (BTP) using client certificate authentication with Playwright.

## Prerequisites

- Node.js 20 or later
- A valid client certificate for SAP BTP (in PFX/P12 format)
- SAP BTP account access

## Setup

1. Clone this repository:
```bash
git clone https://github.com/marianfoo/sap-btp-cert-auth
cd sap-btp-cert-auth
```

2. Install dependencies:
```bash
npm install
```

3.  Rename `.envTEMPLATE` to `.env`, then set your certificate passphrase:
```bash
SAPPFX_PASSPHRASE=your_certificate_passphrase
```

4. Place your PFX certificate file in the root directory as `sap.pfx`

## Local Usage

To run the authentication locally:

1. Ensure your certificate file is in place
2. Set up your environment variables
3. Run the script:
```bash
node index.js
```

## GitHub Actions Setup

To run this in GitHub Actions, you'll need to set up two secrets:

1. `SAPPFX_BASE64`: Your PFX certificate file encoded in base64
   ```bash
   # Generate base64 string from your PFX file
   base64 -i sap.pfx -o sap.txt
   ```
   The content of the `sap.txt` file is the base64 encoded pfx file and can be used in the github action secrets.

2. `SAPPFX_PASSPHRASE`: The passphrase for your PFX certificate

Add these secrets in your GitHub repository: Settings → Secrets and Variables → Actions

## How It Works

The authentication process uses the `playwright-client-certificate-login` package to:

1. Initialize a new certificate authentication session
2. Load the client certificate
3. Navigate to the SAP BTP cockpit
4. Authenticate using the certificate
5. Verify successful login

Key code example:

```javascript
const { CertificateAuthSession } = require('playwright-client-certificate-login');

const sapSession = new CertificateAuthSession({
  origin: 'https://accounts.sap.com',
  url: 'https://emea.cockpit.btp.cloud.sap/cockpit#/',
  pfxPath: './sap.pfx',
  passphrase: process.env.SAPPFX_PASSPHRASE,
  timeout: 60000,
});

await sapSession.authenticate();
```

## GitHub Actions Workflow

The included GitHub Actions workflow:

1. Sets up Node.js environment
2. Installs dependencies and Playwright
3. Decodes the certificate from base64 secret
4. Runs the authentication script
5. Reports success/failure

You can trigger the workflow manually from the Actions tab in your repository.

## Error Handling

The script includes error handling for:
- Certificate loading issues
- Authentication failures
- Network timeouts

Failed authentications will be logged and the script will exit with a non-zero status code.