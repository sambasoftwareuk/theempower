"use client";

import { useToast } from "@/app/_components/ui/use-toast";

export default function TestToastShadcn() {
  const { toast } = useToast();

  return (
    <div className="space-y-4 p-4">
      {/* Birebir aynı basit örnek (Sonner ile karşılaştırma için) */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold mb-2">Basit Örnek (Sonner ile aynı):</h3>
        <button
          onClick={() => {
            toast({
              title: "Başarıyla kaydedildi!",
              variant: "success",
            });
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Toast Göster
        </button>
      </div>

      {/* Shadcn'ın tüm özellikleri */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Shadcn Toast Özellikleri:</h3>
        
        {/* 1. Tüm Toast Türleri */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              toast({
                title: "Başarılı!",
                description: "İşlem başarıyla tamamlandı.",
                variant: "success",
              });
            }}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"
          >
            Success
          </button>
          <button
            onClick={() => {
              toast({
                title: "Hata!",
                description: "Bir hata oluştu.",
                variant: "destructive",
              });
            }}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"
          >
            Error
          </button>
          <button
            onClick={() => {
              toast({
                title: "Uyarı!",
                description: "Dikkatli olun.",
                variant: "warning",
              });
            }}
            className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm"
          >
            Warning
          </button>
          <button
            onClick={() => {
              toast({
                title: "Bilgi",
                description: "Bilgilendirme mesajı.",
                variant: "info",
              });
            }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
          >
            Info
          </button>
          <button
            onClick={() => {
              toast({
                title: "Varsayılan",
                description: "Varsayılan toast mesajı.",
              });
            }}
            className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm"
          >
            Default
          </button>
        </div>

        {/* 2. Description ile */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium mb-2">Description ile:</h4>
          <button
            onClick={() => {
              toast({
                title: "Dosya yüklendi",
                description: "image.jpg dosyası başarıyla yüklendi.",
                variant: "success",
              });
            }}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"
          >
            Description Örneği
          </button>
        </div>

        {/* 3. Action Button ile */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium mb-2">Action Button ile:</h4>
          <button
            onClick={() => {
              toast({
                title: "E-posta gönderildi",
                description: "E-postanız başarıyla gönderildi.",
                variant: "success",
                action: (
                  <button
                    onClick={() => alert("Geri alındı")}
                    className="px-2 py-1 text-xs bg-white text-green-600 rounded hover:bg-green-50"
                  >
                    Geri Al
                  </button>
                ),
              });
            }}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"
          >
            Action Button
          </button>
        </div>

        {/* 4. Custom Duration */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium mb-2">Custom Duration (10 saniye):</h4>
          <button
            onClick={() => {
              toast({
                title: "Uzun süreli mesaj",
                description: "Bu mesaj 10 saniye görünecek.",
                variant: "info",
                duration: 10000,
              });
            }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
          >
            Uzun Süreli
          </button>
        </div>

        {/* 5. Custom JSX Content */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium mb-2">Custom JSX Content:</h4>
          <button
            onClick={() => {
              toast({
                title: (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <span>Özel İçerik</span>
                  </div>
                ),
                description: (
                  <div>
                    <p className="font-semibold">Özel JSX içeriği</p>
                    <p className="text-xs mt-1">Bu Shadcn'ın güçlü özelliği!</p>
                  </div>
                ),
                variant: "success",
              });
            }}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"
          >
            Custom JSX
          </button>
        </div>

        {/* 6. Promise Toast (Loading → Success/Error) - Shadcn'da manuel implementasyon */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium mb-2">Promise Toast (Loading → Success):</h4>
          <button
            onClick={async () => {
              const loadingToast = toast({
                title: "Dosya yükleniyor...",
                variant: "default",
              });

              try {
                const data = await new Promise((resolve) => {
                  setTimeout(() => resolve({ name: "Dosya.pdf" }), 2000);
                });

                loadingToast.update({
                  title: `${data.name} başarıyla yüklendi!`,
                  variant: "success",
                });
              } catch (error) {
                loadingToast.update({
                  title: "Yükleme başarısız oldu",
                  variant: "destructive",
                });
              }
            }}
            className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm"
          >
            Promise Toast
          </button>
        </div>

        {/* 7. API Call Örneği */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium mb-2">API Call Örneği:</h4>
          <button
            onClick={async () => {
              try {
                // Simüle edilmiş API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                toast({
                  title: "Giriş başarılı",
                  description: "Hoş geldiniz!",
                  variant: "success",
                });
              } catch {
                toast({
                  title: "Giriş başarısız",
                  description: "Lütfen tekrar deneyin.",
                  variant: "destructive",
                });
              }
            }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
          >
            API Call
          </button>
        </div>

        {/* 8. Custom Styling (Shadcn'ın avantajı - tam kontrol) */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium mb-2">Custom Styling (Shadcn Avantajı):</h4>
          <button
            onClick={() => {
              toast({
                title: "Özel Stil",
                description: "Bu toast özel className ile stillendirildi.",
                className: "border-primary bg-primary50 text-primary900",
              });
            }}
            className="px-3 py-1.5 bg-primary text-white rounded text-sm"
          >
            Custom Style
          </button>
        </div>
      </div>
    </div>
  );
}

