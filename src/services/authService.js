import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";

export async function registerUser(email, password, name = "", address = "") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    name,
    address,
    createdAt: new Date().toISOString(),
  });

  return cred.user;
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function listenToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}

export async function deleteUserAccount(user) {
  const uid = user.uid;

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", uid));
  const snap = await getDocs(q);

  const batch = writeBatch(db);
  snap.forEach((docSnap) => batch.delete(docSnap.ref));

  batch.delete(doc(db, "users", uid));

  await batch.commit();

  await deleteUser(user);
}
