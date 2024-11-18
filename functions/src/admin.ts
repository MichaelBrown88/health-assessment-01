import * as admin from 'firebase-admin';

let app: admin.app.App;

export function getAdmin(): admin.app.App {
  if (!app) {
    app = admin.initializeApp();
  }
  return app;
}
