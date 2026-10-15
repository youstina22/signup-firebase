import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// إعدادات مشروعك في Firebase (تم دمجها هنا)
const firebaseConfig = {
    apiKey: "AIzaSyBuRZGGtg-lJbiiAV7tvPfw2-wM_MPsQyw",
    authDomain: "sign-up-cd443.firebaseapp.com",
    projectId: "sign-up-cd443",
    storageBucket: "sign-up-cd443.firebasestorage.app",
    messagingSenderId: "82760080245",
    appId: "1:82760080245:web:3bc44d79e1b93de47f113c"
};

// تهيئة Firebase والـ Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// جلب عناصر الفورم (تأكد أن الـ IDs في الـ HTML مطابقة لهذه الأسماء)
const signupForm = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

const signupButton = document.getElementById("signup-button");
const buttonText = document.getElementById("button-text");
const buttonSpinner = document.getElementById("button-spinner");
const messageBox = document.getElementById("message");

// عرض الرسائل للمستخدم
function showMessage(message, type) {
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    messageBox.hidden = false;
}

// مسح الرسائل
function clearMessage() {
    if (!messageBox) return;
    messageBox.textContent = "";
    messageBox.className = "message";
    messageBox.hidden = true;
}

// التحكم في حالة التحميل للزر
function setLoading(isLoading) {
    if (!signupButton) return;
    signupButton.disabled = isLoading;
    if (buttonSpinner) buttonSpinner.hidden = !isLoading;
    if (buttonText) {
        buttonText.textContent = isLoading ? "Creating account..." : "Create account";
    }
}

// تحويل أكواد أخطاء Firebase إلى رسائل مفهومة
function getFirebaseErrorMessage(error) {
    switch (error.code) {
        case "auth/email-already-in-use":
            return "هذا البريد الإلكتروني مستخدم بالفعل. جرب تسجيل الدخول.";
        case "auth/invalid-email":
            return "برجاء إدخال بريد إلكتروني صالح.";
        case "auth/weak-password":
            return "كلمة المرور ضعيفة جداً، اختر كلمة مرور أقوى.";
        case "auth/operation-not-allowed":
            return "التسجيل بالبريد وكلمة المرور غير مفعل في إعدادات Firebase.";
        case "auth/too-many-requests":
            return "محاولات كثيرة جداً، برجاء المحاولة لاحقاً.";
        case "auth/network-request-failed":
            return "خطأ في الاتصال بالإنترنت.";
        default:
            return "حدث خطأ ما، برجاء المحاولة مرة أخرى.";
    }
}

// التعامل مع إرسال الفورم
if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // التحقق من تطابق كلمتي المرور
        if (password !== confirmPassword) {
            showMessage("كلمتا المرور غير متطابقتين.", "error");
            confirmPasswordInput.focus();
            return;
        }

        // التحقق من طول كلمة المرور
        if (password.length < 6) {
            showMessage("يجب أن تكون كلمة المرور 6 أحرف على الأقل.", "error");
            passwordInput.focus();
            return;
        }

        setLoading(true);

        try {
            // إنشاء المستخدم في Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            showMessage("تم إنشاء الحساب بنجاح!", "success");

            // تفريغ حقول الباسورد بعد التسجيل الناجح
            passwordInput.value = "";
            confirmPasswordInput.value = "";

            console.log("Registered user UID:", user.uid);

            // يمكنك تحويله لصفحة أخرى إذا أردت:
            // window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Firebase sign-up error:", error.code);
            showMessage(getFirebaseErrorMessage(error), "error");
        } finally {
            setLoading(false);
        }
    });

    // مسح الرسائل القديمة عند الكتابة
    signupForm.addEventListener("input", clearMessage);
}