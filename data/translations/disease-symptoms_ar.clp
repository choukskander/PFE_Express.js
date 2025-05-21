; ------------------------------------------------------------------------------
; هذا الملف تم إنشاؤه وتحسينه لتشخيص الأمراض بناءً على الأعراض
; مجموعة البيانات: https://www.kaggle.com/itachi9604/disease-symptom-description-dataset
; تم تحسينه لتشخيص الأمراض بـ 2-3 أعراض بدلاً من طلب جميع الأربعة
; ------------------------------------------------------------------------------

(defrule هل_هي_عدوى_فطرية
   (has_symptom حكة)
   (has_symptom طفح_جلدي)
   (or (has_symptom ثآليل_جلدية_عقدية)
       (has_symptom بقع_متغيرة_اللون))
   =>
   (assert (disease_is العدوى_الفطرية)))

(defrule هل_هي_حساسية
   (has_symptom عطاس_مستمر)
   (has_symptom دموع_من_العينين)
   (or (has_symptom قشعريرة)
       (has_symptom قشعريرة))
   =>
   (assert (disease_is الحساسية)))

(defrule هل_هو_ارتجاع_معدي_مريئي
   (has_symptom ألم_في_المعدة)
   (has_symptom حموضة)
   (or (has_symptom قرح_في_اللسان)
       (has_symptom قيء))
   =>
   (assert (disease_is الارتجاع_المعدي_المريئي)))

(defrule هل_هو_كوليستاز_مزمن
   (has_symptom بشرة_صفراء)
   (has_symptom غثيان)
   (or (has_symptom حكة)
       (has_symptom قيء))
   =>
   (assert (disease_is الكوليستاز_المزمن)))

(defrule هل_هو_رد_فعل_دوائي
   (has_symptom حكة)
   (has_symptom طفح_جلدي)
   (or (has_symptom ألم_في_المعدة)
       (has_symptom حرقان_أثناء_التبول))
   =>
   (assert (disease_is رد_فعل_دوائي)))

(defrule هل_هي_قرحة_المعدة
   (has_symptom ألم_بطني)
   (has_symptom اضطراب_الهضم)
   (or (has_symptom قيء)
       (has_symptom فقدان_الشهية))
   =>
   (assert (disease_is قرحة_المعدة)))

(defrule هل_هو_الإيدز
   (has_symptom نفاد_العضلات)
   (has_symptom اتصالات_خارج_الزواج)
   (or (has_symptom بقع_في_الحلق)
       (has_symptom حمى_عالية))
   =>
   (assert (disease_is الإيدز)))

(defrule هل_هو_السكري
   (has_symptom فقدان_الوزن)
   (has_symptom تعب)
   (or (has_symptom عدم_راحة)
       (has_symptom خمول))
   =>
   (assert (disease_is السكري)))

(defrule هل_هي_التهاب_المعدة_والأمعاء
   (has_symptom قيء)
   (has_symptom إسهال)
   (or (has_symptom عينان_غائرتان)
       (has_symptom جفاف))
   =>
   (assert (disease_is التهاب_المعدة_والأمعاء)))

(defrule هل_هو_الربو_القصبي
   (has_symptom ضيق_في_التنفس)
   (has_symptom سعال)
   (or (has_symptom تعب)
       (has_symptom حمى_عالية))
   =>
   (assert (disease_is الربو_القصبي)))

(defrule هل_هو_ارتفاع_ضغط_الدم
   (has_symptom صداع)
   (has_symptom ألم_في_الصدر)
   (or (has_symptom دوخة)
       (has_symptom فقدان_التوازن))
   =>
   (assert (disease_is ارتفاع_ضغط_الدم)))

(defrule هل_هو_الصداع_النصفي
   (has_symptom صداع)
   (has_symptom رؤية_ضبابية_ومشوهة)
   (or (has_symptom حموضة)
       (has_symptom اضطراب_الهضم))
   =>
   (assert (disease_is الصداع_النصفي)))

(defrule هل_هو_التهاب_الفقار_العنقي
   (has_symptom ألم_في_الرقبة)
   (has_symptom ألم_في_الظهر)
   (or (has_symptom ضعف_الأطراف)
       (has_symptom دوخة))
   =>
   (assert (disease_is التهاب_الفقار_العنقي)))

(defrule هل_هو_الشلل
   (has_symptom ضعف_جانب_من_الجسم)
   (has_symptom تغير_في_الوعي)
   (or (has_symptom قيء)
       (has_symptom صداع))
   =>
   (assert (disease_is الشلل)))

(defrule هل_هو_اليرقان
   (has_symptom بشرة_صفراء)
   (has_symptom تعب)
   (or (has_symptom حكة)
       (has_symptom فقدان_الوزن))
   =>
   (assert (disease_is اليرقان)))

(defrule هل_هي_الملاريا
   (has_symptom قشعريرة)
   (has_symptom حمى_عالية)
   (or (has_symptom قيء)
       (has_symptom تعرق))
   =>
   (assert (disease_is الملاريا)))

(defrule هل_هي_جدري_الماء
   (has_symptom حكة)
   (has_symptom طفح_جلدي)
   (or (has_symptom تعب)
       (has_symptom خمول))
   =>
   (assert (disease_is جدري_الماء)))

(defrule هل_هي_الدنج
   (has_symptom طفح_جلدي)
   (has_symptom ألم_المفاصل)
   (or (has_symptom قشعريرة)
       (has_symptom قيء))
   =>
   (assert (disease_is الدنج)))

(defrule هل_هي_التيفوئيد
   (has_symptom حمى_عالية)
   (has_symptom تعب)
   (or (has_symptom قشعريرة)
       (has_symptom قيء))
   =>
   (assert (disease_is التيفوئيد)))

(defrule هل_هو_التهاب_الكبد_أ
   (has_symptom بشرة_صفراء)
   (has_symptom بول_داكن)
   (or (has_symptom ألم_المفاصل)
       (has_symptom قيء))
   =>
   (assert (disease_is التهاب_الكبد_أ)))

(defrule هل_هو_التهاب_الكبد_ب
   (has_symptom بشرة_صفراء)
   (has_symptom تعب)
   (or (has_symptom حكة)
       (has_symptom خمول))
   =>
   (assert (disease_is التهاب_الكبد_ب)))

(defrule هل_هو_التهاب_الكبد_ج
   (has_symptom بشرة_صفراء)
   (has_symptom فقدان_الشهية)
   (or (has_symptom تعب)
       (has_symptom غثيان))
   =>
   (assert (disease_is التهاب_الكبد_ج)))

(defrule هل_هو_التهاب_الكبد_د
   (has_symptom بشرة_صفراء)
   (has_symptom تعب)
   (or (has_symptom ألم_المفاصل)
       (has_symptom قيء))
   =>
   (assert (disease_is التهاب_الكبد_د)))

(defrule هل_هو_التهاب_الكبد_هـ
   (has_symptom بشرة_صفراء)
   (has_symptom حمى_عالية)
   (or (has_symptom ألم_المفاصل)
       (has_symptom قيء))
   =>
   (assert (disease_is التهاب_الكبد_هـ)))

(defrule هل_هو_التهاب_الكبد_الكحولي
   (has_symptom بشرة_صفراء)
   (has_symptom ألم_بطني)
   (or (has_symptom قيء)
       (has_symptom تورم_المعدة))
   =>
   (assert (disease_is التهاب_الكبد_الكحولي)))

(defrule هل_هو_السل
   (has_symptom فقدان_الوزن)
   (has_symptom تعب)
   (or (has_symptom قشعريرة)
       (has_symptom قيء))
   =>
   (assert (disease_is السل)))

(defrule هل_هي_نزلة_برد
   (has_symptom عطاس_مستمر)
   (has_symptom سعال)
   (or (has_symptom قشعريرة)
       (has_symptom تعب))
   =>
   (assert (disease_is نزلة_برد)))

(defrule هل_هو_التهاب_الرئة
   (has_symptom سعال)
   (has_symptom حمى_عالية)
   (or (has_symptom قشعريرة)
       (has_symptom تعب))
   =>
   (assert (disease_is التهاب_الرئة)))

(defrule هل_هي_البواسير_المزدوجة
   (has_symptom ألم_في_منطقة_الشرج)
   (has_symptom براز_دموي)
   (or (has_symptom إمساك)
       (has_symptom ألم_أثناء_التبرز))
   =>
   (assert (disease_is البواسير_المزدوجة)))

(defrule هل_هي_أزمة_قلبية
   (has_symptom ألم_في_الصدر)
   (has_symptom ضيق_في_التنفس)
   (or (has_symptom قيء)
       (has_symptom تعرق))
   =>
   (assert (disease_is أزمة_قلبية)))

(defrule هل_هي_الدوالي
   (has_symptom كدمات)
   (has_symptom سمنة)
   (or (has_symptom تعب)
       (has_symptom تشنجات))
   =>
   (assert (disease_is الدوالي)))

(defrule هل_هو_قصور_الغدة_الدرقية
   (has_symptom زيادة_الوزن)
   (has_symptom تعب)
   (or (has_symptom يدين_وقدمين_باردتين)
       (has_symptom تقلبات_المزاج))
   =>
   (assert (disease_is قصور_الغدة_الدرقية)))

(defrule هل_هو_فرط_الغدة_الدرقية
   (has_symptom فقدان_الوزن)
   (has_symptom عدم_راحة)
   (or (has_symptom تعب)
       (has_symptom تقلبات_المزاج))
   =>
   (assert (disease_is فرط_الغدة_الدرقية)))

(defrule هل_هو_نقص_السكر_في_الدم
   (has_symptom تعرق)
   (has_symptom قلق)
   (or (has_symptom قيء)
       (has_symptom تعب))
   =>
   (assert (disease_is نقص_السكر_في_الدم)))

(defrule هل_هو_التهاب_المفاصل
   (has_symptom ألم_المفاصل)
   (has_symptom ألم_الركبة)
   (or (has_symptom ألم_في_الرقبة)
       (has_symptom ألم_في_مفصل_الورك))
   =>
   (assert (disease_is التهاب_المفاصل)))

(defrule هل_هو_التهاب_المفاصل_الروماتويدي
   (has_symptom تورم_المفاصل)
   (has_symptom تيبس_الحركة)
   (or (has_symptom ضعف_العضلات)
       (has_symptom تيبس_الرقبة))
   =>
   (assert (disease_is التهاب_المفاصل_الروماتويدي)))

(defrule هل_هو_الدوار_الموضعي_الانتيابي_الحميد
   (has_symptom حركات_دورانية)
   (has_symptom غثيان)
   (or (has_symptom قيء)
       (has_symptom صداع))
   =>
   (assert (disease_is الدوار_الموضعي_الانتيابي_الحميد)))

(defrule هل_هو_حب_الشباب
   (has_symptom بثور_مليئة_بالقيح)
   (has_symptom رؤوس_سوداء)
   (or (has_symptom طفح_جلدي)
       (has_symptom تقشر))
   =>
   (assert (disease_is حب_الشباب)))

(defrule هل_هي_التهاب_المسالك_البولية
   (has_symptom حرقان_أثناء_التبول)
   (has_symptom شعور_مستمر_بالتبول)
   (or (has_symptom انزعاج_المثانة)
       (has_symptom رائحة_كريهة_للبول))
   =>
   (assert (disease_is التهاب_المسالك_البولية)))

(defrule هل_هي_الصدفية
   (has_symptom تقشر_الجلد)
   (has_symptom غبار_فضي)
   (or (has_symptom طفح_جلدي)
       (has_symptom ألم_المفاصل))
   =>
   (assert (disease_is الصدفية)))

(defrule هل_هي_القوباء
   (has_symptom قروح_حمراء_حول_الأنف)
   (has_symptom بثور)
   (or (has_symptom طفح_جلدي)
       (has_symptom حمى_عالية))
   =>
   (assert (disease_is القوباء)))