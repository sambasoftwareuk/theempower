"use client";

import { toast } from "sonner";

export default function TestToast() {
  return (
    <button
      onClick={() => toast.success("Başarıyla kaydedildi!")}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Toast Göster
    </button>
  );
}

//? Toast yapisini sayfada cagirip kullanma yontemi
// import TestToast from "@/components/TestToast";

// export default function Page() {
//   return (
//     <div className="p-8">
//       <TestToast />
//     </div>
//   );
// }

//?Bonus: En Çok Kullanılan Toast Türleri
// toast.success("İşlem başarılı");
// toast.error("Bir hata oluştu");
// toast.warning("Dikkat!");
// toast.info("Bilgi mesajı");

// toast("Custom mesaj");

//?API Call Sonrası Örnek
// try {
//     await fetch("/api/login");
//     toast.success("Giriş başarılı");
//   } catch {
//     toast.error("Giriş başarısız");
//   }

//!TODO bu componnet daha sonra silinecek.
