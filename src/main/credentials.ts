import { Credentials } from '../shared/models/credentials'
import { join } from 'path'
import { app, safeStorage } from 'electron'
import * as fs from 'fs'

const credentialsFilePath = join(app.getPath('userData'), 'credentials.json')

export function credentialsAvailable(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.stat(credentialsFilePath, (err) => {
      if (!err) {
        resolve(true)
      }
      if (err?.code === 'ENOENT') {
        resolve(false)
      }
      reject(err)
    })
  })
}

export function credentialsStorageAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!safeStorage.isEncryptionAvailable()) {
      resolve(false)
    }
    resolve(true)
  })
}

export function saveCredentials(credentials: Credentials) {
  if (!safeStorage.isEncryptionAvailable()) {
    return
  }
  const encryptedIdentity = safeStorage.encryptString(credentials.identity)
  const encryptedCredential = safeStorage.encryptString(credentials.credential)
  const encryptedCredentials = {
    identity: encryptedIdentity.toString('base64'),
    credential: encryptedCredential.toString('base64')
  } as Credentials
  fs.writeFile(credentialsFilePath, JSON.stringify(encryptedCredentials), (err) => {
    console.error(err)
  })
}

export function loadCredentials(): Promise<Credentials> {
  return new Promise<Credentials>((resolve, reject) => {
    if (!safeStorage.isEncryptionAvailable()) {
      reject(new Error('No system encryption available'))
    }
    fs.readFile(credentialsFilePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      }
      const encryptedCredentials = JSON.parse(data)
      const decryptedIdentity = safeStorage.decryptString(
        Buffer.from(encryptedCredentials.identity, 'base64')
      )
      const decryptedCredential = safeStorage.decryptString(
        Buffer.from(encryptedCredentials.credential, 'base64')
      )
      const decryptedCredentials = {
        identity: decryptedIdentity,
        credential: decryptedCredential
      } as Credentials
      resolve(decryptedCredentials)
    })
  })
}

export function clearCredentials() {
  fs.unlink(credentialsFilePath, (err) => console.error(err))
}
