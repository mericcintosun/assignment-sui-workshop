# Sui Wallet Setup ve Troubleshooting

## Kurulum Adımları

### 1. Environment Dosyası

`.env.local` dosyası oluşturuldu:

```
NEXT_PUBLIC_SUI_NETWORK=testnet
```

### 2. Sui Wallet Kurulumu

1. [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil) Chrome extension'ını yükleyin
2. Yeni bir wallet oluşturun veya mevcut wallet'ı import edin
3. Testnet network'üne geçin

### 3. Testnet SUI Token'ları

1. [Sui Testnet Faucet](https://discord.gg/sui) adresinden test SUI token'ları alın
2. Veya `/faucet` sayfasından token alın (eğer faucet çalışıyorsa)

## Transaction Test Adımları

### 1. Basit Test Transaction

1. `/voting` sayfasına gidin
2. "Test Wallet Connection" butonuna tıklayın
3. Sui Wallet'ta transaction'ı onaylayın

### 2. Proposal Oluşturma Test

1. "Create Proposal" butonuna tıklayın
2. Form'u doldurun
3. "Create Proposal" butonuna tıklayın
4. Sui Wallet'ta transaction'ı onaylayın

### 3. Voting Test

1. Bir proposal seçin
2. Bir option seçin
3. "Vote" butonuna tıklayın
4. Sui Wallet'ta transaction'ı onaylayın

## Troubleshooting

### Wallet Bağlantı Sorunları

- Sui Wallet extension'ının yüklü olduğundan emin olun
- Browser'ı yenileyin
- Diğer wallet extension'larını geçici olarak devre dışı bırakın
- Sui Wallet'ta doğru network'ün seçili olduğundan emin olun (testnet)

### Transaction Hataları

- Yeterli SUI token'ınız olduğundan emin olun (gas fees için)
- Network bağlantınızı kontrol edin
- Console'da hata mesajlarını kontrol edin

### Contract Sorunları

- Contract'ların deploy edildiğinden emin olun
- Contract address'lerinin doğru olduğunu kontrol edin
- Move contract'larının doğru çalıştığını test edin

## Debug Bilgileri

Voting sayfasında debug bilgileri görüntülenir:

- Environment
- Network
- Account bağlantı durumu
- Account address
- Public key
- Chains

## Sonraki Adımlar

1. Basit transaction'lar çalışıyorsa, gerçek Move contract çağrılarını aktif edin
2. Proposal ve VotingResults object'lerini blockchain'den fetch edin
3. Real-time data güncellemelerini implement edin
4. Error handling'i geliştirin

## Önemli Notlar

- Sui Wallet testnet'te çalışır
- Gas fees için yeterli SUI token'ına ihtiyacınız var
- Contract'lar deploy edilmiş olmalı
- Network ayarları doğru olmalı
