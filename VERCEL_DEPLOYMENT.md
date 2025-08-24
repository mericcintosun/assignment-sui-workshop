# Vercel Deployment Guide

Bu projeyi Vercel'de testnet olarak deploy etmek için aşağıdaki adımları takip edin.

## 1. Environment Variables

Vercel dashboard'da aşağıdaki environment variables'ları ekleyin:

### Sui Network Configuration

```
NEXT_PUBLIC_SUI_NETWORK=testnet
```

### Contract Package IDs (Testnet)

```
NEXT_PUBLIC_NFT_MINT_PACKAGE_ID=0x5d07a98be794c07aff92b1d725e3a2bee1e46c1a8f46f21ba35cda93352c2b09
NEXT_PUBLIC_NFT_MINT_OBJECT_ID=0x02e96ab32da0778534c94940a5a98b15653f5124f532f077466d7162a570da1e

NEXT_PUBLIC_VOTING_PACKAGE_ID=0xa1818ad3bd428551eb1b6330dabe007270065630b2694cc26982afab0bb1cb07
NEXT_PUBLIC_VOTING_PROPOSAL_CREATOR_OBJECT=0x60b07a041537c9b590297e11876fcb20e50526d97480c8429ae74d75eedc581a

NEXT_PUBLIC_GUESTBOOK_PACKAGE_ID=0xcb381d2853694ec22e2fdc33c172d9bca36897e9ddd20784608b1af6f7a1df45
NEXT_PUBLIC_GUESTBOOK_OBJECT_ID=0x3ad6d6632c94a6480dcec19d6870c22620ea320b9c72d02336141e8cf50cd65c
NEXT_PUBLIC_GUESTBOOK_MANAGER_OBJECT=0x91237bddf543b5f136c93071b2542dac4b6d34665aa38e1a33f4b512dcf05cfc

NEXT_PUBLIC_FAUCET_PACKAGE_ID=0xfcc18222140ac7eb4988223d7064153e90393f1117b338865bbaa111a3eef265
NEXT_PUBLIC_FAUCET_OBJECT_ID=0x4737dd246537d91c9f4bd6679c7c846e222b33a6dea96b955ad934429598d63a
NEXT_PUBLIC_FAUCET_MANAGER_OBJECT=0x52c44095c1a9ed156efdb585e56d281d2ac475c65f056830fb28a9ff2ee7ff74

NEXT_PUBLIC_TIP_JAR_PACKAGE_ID=0x5e67a89ce855640722974ce148dab73935348447e7c9de67e0dd4483dbdb6855
NEXT_PUBLIC_TIP_JAR_OBJECT_ID=0x92f16348ff35fb02189ca8f166962f7a9bb8e44b6762a31c93d5ce557047435f
NEXT_PUBLIC_TIP_JAR_MANAGER_OBJECT=0xe4e0cf6cb39599997cf07d8c0fefab7ab524becdea0a348c01b5305808fa63c8
```

### App Configuration

```
NEXT_PUBLIC_APP_NAME="Sui dApp Workshop"
NEXT_PUBLIC_APP_DESCRIPTION="A modern Sui dApp built with Next.js and dApp Kit"
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### Environment

```
NODE_ENV=production
```

## 2. Vercel Dashboard Setup

1. **Vercel'e giriş yapın** ve yeni proje oluşturun
2. **GitHub repository'nizi bağlayın**
3. **Framework Preset**: Next.js seçin
4. **Root Directory**: `./` (varsayılan)
5. **Build Command**: `yarn build` (package.json'da yarn kullanıyoruz)
6. **Output Directory**: `.next` (varsayılan)
7. **Install Command**: `yarn install`

## 3. Environment Variables Ekleme

Vercel dashboard'da:

1. Proje ayarlarına gidin
2. "Environment Variables" sekmesine tıklayın
3. Yukarıdaki tüm environment variables'ları ekleyin
4. **Production**, **Preview**, ve **Development** environment'ları için işaretleyin

## 4. Build Settings

### Build Command

```bash
yarn build
```

### Install Command

```bash
yarn install
```

### Node.js Version

Vercel otomatik olarak uygun Node.js versiyonunu seçecek (18.x veya üzeri)

## 5. Domain Configuration

Deploy sonrası:

1. Vercel otomatik olarak bir domain verecek (örn: `your-app-name.vercel.app`)
2. Custom domain eklemek isterseniz "Domains" sekmesinden ekleyebilirsiniz
3. `NEXT_PUBLIC_APP_URL` environment variable'ını güncelleyin

## 6. Deployment Checklist

- [ ] Tüm environment variables eklendi
- [ ] Build command doğru (`yarn build`)
- [ ] Install command doğru (`yarn install`)
- [ ] Framework preset Next.js seçildi
- [ ] Production environment variables işaretlendi

## 7. Post-Deployment

Deploy sonrası kontrol edin:

1. **Wallet Connection**: Sui Wallet ve Slush Wallet çalışıyor mu?
2. **Voting**: Proposal oluşturma ve voting çalışıyor mu?
3. **NFT Minting**: NFT mint işlemi çalışıyor mu?
4. **Faucet**: Test SUI çekme çalışıyor mu?

## 8. Troubleshooting

### Build Hatası

- Node.js versiyonunu kontrol edin (18.x+)
- `yarn.lock` dosyasının commit edildiğinden emin olun
- Turbopack build hatası varsa, `package.json`'da `"build": "next build"` olduğundan emin olun

### Environment Variables Hatası

- Tüm `NEXT_PUBLIC_` prefix'li variables'ların eklendiğinden emin olun
- Production environment'ı işaretlendiğinden emin olun

### Wallet Connection Hatası

- Testnet network'ünün doğru olduğundan emin olun
- Contract address'lerinin testnet'te deploy edildiğinden emin olun

## 9. Local Testing

Deploy öncesi local'de test etmek için:

1. **Local environment dosyası oluşturun**:

```bash
# .env.local dosyası oluşturun ve yukarıdaki environment variables'ları ekleyin
```

2. **Dependencies'leri yükleyin**:

```bash
yarn install
```

3. **Development server'ı başlatın**:

```bash
yarn dev
```

## 10. Monitoring

Vercel dashboard'da:

- **Analytics**: Traffic ve performance
- **Functions**: Serverless function logs
- **Deployments**: Build ve deployment logs

## 11. Quick Deploy Commands

### Local Build Test

```bash
yarn install
yarn build
```

### Environment Variables Test

```bash
# .env.local dosyasında tüm variables'ların doğru olduğundan emin olun
yarn dev
```

## 12. Important Notes

- **Turbopack**: Production build'de turbopack kullanılmıyor (Vercel uyumluluğu için)
- **Environment Variables**: Tüm contract address'leri environment variables olarak ayarlandı
- **Fallback Values**: Environment variables yoksa hardcoded değerler kullanılıyor
- **Network**: Testnet olarak ayarlandı, mainnet için değiştirmeniz gerekir

## 13. Custom Domain Setup

Eğer custom domain kullanmak istiyorsanız:

1. Vercel dashboard'da "Domains" sekmesine gidin
2. Custom domain'inizi ekleyin
3. DNS ayarlarını yapın
4. `NEXT_PUBLIC_APP_URL` environment variable'ını güncelleyin
