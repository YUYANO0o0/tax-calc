import { useState, useMemo } from 'react';
import './App.css';

type Lang = 'ja' | 'zh-CN' | 'zh-TW' | 'en';

function App() {
  const [lang, setLang] = useState<Lang>('ja');
  const [inputValue, setInputValue] = useState<string>('1,100,000');

  const taxIncludedPrice = useMemo(() => Number(inputValue.replace(/,/g, '')), [inputValue]);

  const result = useMemo(() => {
    const a = taxIncludedPrice || 0;
    const b = Math.round(a / 1.1);
    const c = Math.round(b * 0.95);
    const d = Math.round(c * 0.1);
    const e = Math.round(c * 0.0155);
    const f = d - e;
    const g = Math.round(c * 1.1);
    const h = g - f;
    const saved = a - h;
    return { a, b, c, d, e, f, g, h, saved };
  }, [taxIncludedPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '') setInputValue('');
    else if (/^\d*$/.test(rawValue)) setInputValue(rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  };

  const labels: Record<Lang, { title: string, items: string[], refundDesc: string }> = {
    ja: {
      title: "免税・ショッピングクーポン\n使用後の最終価格",
      items: [
        "価格（税込）",
        "価格（税抜）",
        "ショッピングクーポン使用\n5%OFF価格 (b)×0.95",
        "【消費税 10%】 (c)×0.1",
        "【手数料 1.55%】 (c)×0.0155",
        "【免税額】 (d-e)",
        "【店で支払う金額】\nショッピングクーポン使用\n5%OFF価格税込(c)×1.1",
        "【最終価格】 (g) - (f)",
        "得した金額 (a) - (h)"
      ],
      refundDesc: "※免税カウンターで免税手続きをして返ってくる現金"
    },
    'zh-CN': {
      title: "免税/购物优惠券使用后的最终价格",
      items: ["价格（含税）", "价格（不含税）", "购物优惠券使用\n5%OFF价格 (b)×0.95", "【消费税 10%】 (c)×0.1", "【手续费 1.55%】 (c)×0.0155", "【免税额】 (d-e)", "【店內应付金额】\n购物优惠券使用5%OFF含税价格(c)×1.1", "【最终价格】 (g) - (f)", "【省下金额】 (a) - (h)"],
      refundDesc: "※在退税柜台办理免税手续后退回的现金"
    },
    'zh-TW': {
      title: "免稅/購物優惠券使用後的最終價格",
      items: ["價格（含稅）", "價格（不含稅）", "購物優惠券使用\n5%OFF價格 (b)×0.95", "【消費稅 10%】 (c)×0.1", "【手續稅 1.55%】 (c)×0.0155", "【免稅額】 (d-e)", "【店內应付金额】\n購物優惠券使用5%OFF含稅價格(c)×1.1", "【最終價格】 (g) - (f)", "【省下金额】 (a) - (h)"],
      refundDesc: "※在退稅櫃檯辦理免稅手續後退回的現金"
    },
    en: {
      title: "Final Price After Tax Exemption & Shopping Coupon",
      items: ["Price (Tax Incl.)", "Price (Tax Excl.)", "5% OFF Price with Coupon\n(b)×0.95", "【Consumption Tax 10%】 (c)×0.1", "【Service Fee 1.55%】 (c)×0.0155", "【Tax Refund Amount】 (d-e)", "【Amount due at the store】\n5% OFF Price (Tax Incl)", "【Final Price】 (g)-(f)", "【Amount Saved】 (a)-(h)"],
      refundDesc: "※The tax refund received after completing the tax-free procedure at the counter."
    }
  };

  const current = labels[lang];
  const RedCode = ({ code }: { code: string }) => <span style={{ color: '#ff7e7e', width: '30px', textAlign: 'right', flexShrink: 0, alignSelf: 'center' }}>{code}</span>;

  const Row = ({ label, value, code, bold = false, highlight = false, isRefund = false, emphasize = false, finalPrice = false }: any) => {
    const lines = typeof label === 'string' ? label.split('\n') : [label];

    // 「【最終価格】」という文字列を赤くするための関数
    const renderLabel = (text: string) => {
      if (text.includes("【最終価格】")) {
        return (
          <>
            <span style={{ color: 'red' }}>【最終価格】</span>
            {text.replace("【最終価格】", "")}
          </>
        );
      }
      return text;
    };

    return (
      <div style={{ paddingBottom: '10px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: emphasize ? '10px' : '12px 0', 
          borderBottom: emphasize ? 'none' : '1px solid #eee',
          border: emphasize ? '3px solid #ff7e7e' : 'none',
          borderRadius: emphasize ? '8px' : '0px'
        }}>
          <span style={{ flex: 1, paddingRight: '15px', textAlign: 'center' }}>
            {lines.map((line: string, index: number) => (
              <span key={index} style={{ 
                display: 'block',
                // 見出し(index 0)は常に通常サイズ、それ以外(説明文)は小さく
                fontSize: index === 0 ? '0.95rem' : '0.8rem',
                color: index === 0 ? 'inherit' : '#aaa',
                fontWeight: (index === 0 && !emphasize && bold) ? 'bold' : 'normal'
              }}>
                {renderLabel(line)}
              </span>
            ))}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ 
              fontWeight: (bold || emphasize || finalPrice) ? 'bold' : 'normal', 
              color: finalPrice ? '#ff7e7e' : (highlight ? '#ff9999' : 'inherit'), 
              marginRight: '15px',
              fontSize: finalPrice ? '1.5rem' : (emphasize ? '1.5rem' : '0.95rem')
            }}>
              {typeof value === 'string' ? value : `¥${value.toLocaleString()}`}
            </span>
            <RedCode code={code} />
          </div>
        </div>
        {isRefund && <div style={{ fontSize: '0.8rem', color: '#aaa', padding: '5px 0' }}>{current.refundDesc}</div>}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: "'Noto Sans SC', 'Noto Sans JP', sans-serif" }}>
      <div style={{ display: 'flex', gap: '0px', marginBottom: '20px', width: '100%' }}>
        {[
          { id: 'ja', label: '日本語' },
          { id: 'zh-CN', label: '简体中文' },
          { id: 'zh-TW', label: '繁體中文' },
          { id: 'en', label: 'English' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setLang(item.id as Lang)}
            style={{ 
              flex: '1 1 25%', height: '40px', cursor: 'pointer',
              backgroundColor: lang === item.id ? '#555' : '#eee',
              border: '2px solid', borderColor: lang === item.id ? '#fff' : '#ccc',
              fontWeight: 'bold', whiteSpace: 'nowrap',
              color: lang === item.id ? '#fff' : '#000'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{current.title}</h2>

      <div style={{ fontSize: '0.95rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '2px solid #888', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', flex: 1, textAlign: 'center' }}>{current.items[0]}</span>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ marginRight: '5px' }}>¥</span>
            <input type="text" value={inputValue} onChange={handleInputChange} style={{ width: '120px', padding: '5px', textAlign: 'right', fontSize: '1rem', backgroundColor: 'transparent', color: 'inherit', border: '1px solid #888', borderRadius: '4px' }} />
            <RedCode code="(a)" />
          </div>
        </div>

        <Row label={current.items[1]} value={result.b} code="(b)" />
        <Row label={current.items[2]} value={result.c} code="(c)" />
        <Row label={current.items[3]} value={result.d} code="(d)" />
        <Row label={current.items[4]} value={result.e} code="(e)" />
        <Row label={current.items[5]} value={result.f} code="(f)" highlight={true} isRefund={true} />
        <Row label={current.items[6]} value={result.g} code="(g)" emphasize={true} />
        <Row label={current.items[7]} value={result.h} code="(h)" bold={true} />
        <Row label={current.items[8]} value={result.saved} code="" />
      </div>
    </div>
  );
}

export default App;