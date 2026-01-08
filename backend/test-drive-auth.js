import dotenv from 'dotenv';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function testAuth() {
    console.log("🔍 --- Diagnostic Google Drive Auth ---");
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground';

    console.log(`\n📂 Chargement des credentials :`);
    console.log(`- Client ID: ${clientId ? clientId.substring(0, 15) + '...' : 'MANQUANT ❌'}`);
    console.log(`- Client Secret: ${clientSecret ? clientSecret.substring(0, 5) + '...' : 'MANQUANT ❌'}`);
    console.log(`- Refresh Token: ${refreshToken ? refreshToken.substring(0, 10) + '...' : 'MANQUANT ❌'}`);
    console.log(`- Redirect URI: ${redirectUri}`);

    if (!clientId || !clientSecret || !refreshToken) {
        console.error("\n❌ ERREUR : Il manque des informations dans le fichier .env !");
        return;
    }

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    console.log("\n🔄 Tentative de connexion à l'API Drive...");

    try {
        // Tenter de récupérer les infos de l'utilisateur (test basique)
        const res = await drive.about.get({
            fields: 'user, storageQuota'
        });
        
        console.log("\n✅ SUCCÈS ! Authentification réussie.");
        console.log(`- Utilisateur connecté : ${res.data.user.emailAddress}`);
        console.log(`- Nom : ${res.data.user.displayName}`);
        console.log(`- Espace utilisé : ${(parseInt(res.data.storageQuota.usage) / 1024 / 1024 / 1024).toFixed(2)} GB`);

        // Tester l'accès au dossier
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (folderId) {
            console.log(`\n📂 Vérification du dossier cible (${folderId})...`);
            try {
                const folder = await drive.files.get({ fileId: folderId });
                console.log(`✅ Dossier trouvé : "${folder.data.name}" (MIME: ${folder.data.mimeType})`);
            } catch (folderErr) {
                console.error(`❌ Erreur d'accès au dossier : ${folderErr.message}`);
            }
        }

    } catch (error) {
        console.error("\n❌ ÉCHEC DE L'AUTHENTIFICATION :");
        console.error(`Code erreur : ${error.code}`);
        console.error(`Message : ${error.message}`);
        
        if (error.response && error.response.data) {
            console.error("Détails API :", JSON.stringify(error.response.data, null, 2));
        }

        if (error.message.includes('unauthorized_client')) {
            console.log("\n💡 ANALYSE : 'unauthorized_client'");
            console.log("Cela signifie que le Refresh Token ne correspond pas au Client ID/Secret fournis.");
            console.log("Causes possibles :");
            console.log("1. Vous n'avez pas coché 'Use your own credentials' dans OAuth Playground.");
            console.log("2. Vous avez régénéré le Client Secret mais pas mis à jour le .env.");
            console.log("3. Il y a des espaces invisibles dans le .env.");
        }
    }
}

testAuth();
