const { CertificateAuthSession } = require('playwright-client-certificate-login');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  let sapSession;
  try {
    // Instantiate the CertificateAuthSession
    sapSession = new CertificateAuthSession({
      origin: 'https://accounts.sap.com',
      url: 'https://emea.cockpit.btp.cloud.sap/cockpit#/', // Target URL for login
      pfxPath: './sap.pfx', // Updated PFX file path created in workflow
      passphrase: process.env.SAPPFX_PASSPHRASE, // Passphrase for PFX if needed
      timeout: 60000, // Optional timeout
    });

    // Authenticate
    await sapSession.authenticate();

    // Check if login was successful by verifying the URL or a page element
    const page = sapSession.getPage();
    const currentUrl = page.url();

    if (currentUrl.includes('cockpit')) {
      console.log('Login successful!');
      process.exit(0);  // Exit with success
    } else {
      console.log('Login failed.');
      process.exit(1);  // Exit with failure
    }

  } catch (error) {
    console.error('Error during login:', error.message);
    process.exit(1);  // Exit with failure on error
  } finally {
    // Ensure the session closes properly
    if (sapSession) {
      await sapSession.close();
    }
  }
}

main();
