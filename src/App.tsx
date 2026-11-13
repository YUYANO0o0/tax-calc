import { useState, useMemo } from 'react';
import './App.css';

const APP_RED = '#ff4d4d';
type Lang = 'ja' | 'zh-CN' | 'zh-TW' | 'en' | 'ko';
type LabelPart = { text: string; color?: string };

const getBaseData = (lang: Lang, feeRatePercent: number, useCoupon: boolean) => {
  const data: Record<Lang, LabelPart[][]> = {
    ja: [
      [{ text: "価格（税込）" }], [{ text: "価格（税抜）" }],
      [{ text: "クーポン5%OFF\n(b)×0.95" }], [{ text: "【消費税10%】\n(c)×0.1" }],
      [{ text: "【手数料】\n消費税額×手数料率" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【免税額】\n(d-e)" }],
      [{ text: useCoupon ? "【支払金額】\n5%OFF価格税込\n(c)×1.1" : "【支払金額】" }],
      [{ text: "【最終価格】", color: APP_RED }, { text: "\n(g) - (f)" }],
      [{ text: "得した金額\n(a) - (h)" }]
    ],
    'zh-CN': [
      [{ text: "价格（含税）" }], [{ text: "价格（不含税）" }],
      [{ text: "优惠券5%OFF\n(b)×0.95" }], [{ text: "【消费税10%】\n(c)×0.1" }],
      [{ text: "【手续费】\n消费税额×手续费率" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【免税额】\n(d-e)" }],
      [{ text: useCoupon ? "【支付金额】\n5%OFF含税价\n(c)×1.1" : "【支付金额】" }],
      [{ text: "【最终价格】", color: APP_RED }, { text: "\n(g) - (f)" }],
      [{ text: "【省下金额】\n(a) - (h)" }]
    ],
    'zh-TW': [
      [{ text: "價格（含稅）" }], [{ text: "價格（不含稅）" }],
      [{ text: "優惠券5%OFF\n(b)×0.95" }], [{ text: "【消費稅10%】\n(c)×0.1" }],
      [{ text: "【手續稅】\n消費稅額×手續費率" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【免稅額】\n(d-e)" }],
      [{ text: useCoupon ? "【支付金額】\n5%OFF含稅價\n(c)×1.1" : "【支付金額】" }],
      [{ text: "【最終價格】", color: APP_RED }, { text: "\n(g) - (f)" }],
      [{ text: "【省下金額】\n(a) - (h)" }]
    ],
    en: [
      [{ text: "Price (Tax Incl.)" }], [{ text: "Price (Tax Excl.)" }],
      [{ text: "Coupon 5% OFF\n(b)×0.95" }], [{ text: "【Tax 10%】\n(c)×0.1" }],
      [{ text: "【Service Fee】\nTax Amount×Rate" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【Refund】\n(d-e)" }],
      [{ text: useCoupon ? "【Payment】\nTax Incl. 5% OFF\n(c)×1.1" : "【Payment】" }],
      [{ text: "【Final Price】", color: APP_RED }, { text: "\n(g)-(f)" }],
      [{ text: "【Saved】\n(a)-(h)" }]
    ],
    ko: [
      [{ text: "가격 (세금 포함)" }], [{ text: "가격 (세금 제외)" }],
      [{ text: "쿠폰 5% OFF\n(b)×0.95" }], [{ text: "【소비세 10%】\n(c)×0.1" }],
      [{ text: "【수수료】\n소비세액×수수료율" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【면세액】\n(d-e)" }],
      [{ text: useCoupon ? "【지불 금액】\n5% OFF 가격 세금 포함\n(c)×1.1" : "【지불 금액】" }],
      [{ text: "【최종 가격】", color: APP_RED }, { text: "\n(g) - (f)" }],
      [{ text: "【절약한 금액】\n(a) - (h)" }]
    ]
  };
  return data[lang];
};

const RedCode = ({ code }: { code: string }) => (
  <span style={{ color: APP_RED, width: '30px', textAlign: 'right', flexShrink: 0, fontWeight: 'bold' }}>{code}</span>
);

const Row = ({ labelParts, value, code, emphasize = false, isRefund = false, isFinal = false, refundDesc = "", refundDetailNode = null, showNotice = false, isCouponRow = false, useCoupon = true, setUseCoupon = () => {}, isFeeRow = false, feeDescNode }: any) => (
  <div style={{ padding: '8px 0', borderBottom: emphasize ? 'none' : '1px solid #ddd', backgroundColor: '#ffffff', color: '#000000' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ flex: 1, fontSize: '1rem', lineHeight: 1.2, fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '8px', color: '#000000' }}>
        <span>
          {labelParts.map((part: LabelPart, idx: number) => (
            <span key={idx} style={{ color: part.color || '#000000' }}>
              {part.text.split('\n').map((line: string, i: number) => <span key={i} style={{ display: 'block', textAlign: 'center' }}>{line}</span>)}
            </span>
          ))}
        </span>
        {isCouponRow && (
          <input 
            type="checkbox" 
            checked={useCoupon} 
            onChange={(e) => setUseCoupon(e.target.checked)} 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        )}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontWeight: 'bold', color: isFinal ? '#000000' : (emphasize ? APP_RED : '#000000'), marginRight: '10px', fontSize: emphasize ? '1.6rem' : '1.1rem' }}>
          {typeof value === 'string' ? value : `¥${value.toLocaleString()}`}
        </span>
        <RedCode code={code} />
      </div>
    </div>
    {isFeeRow && (
      <div style={{ fontSize: '0.8rem', color: '#555555', marginTop: '4px', textAlign: 'center' }}>
        {feeDescNode}
      </div>
    )}
    {showNotice && (
      <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '1.15rem', fontWeight: 'bold' }}>
        <span style={{ color: APP_RED }}>【免税連絡票】必要</span>
      </div>
    )}
    {isRefund && (
      <div style={{ fontSize: '0.82rem', color: '#444444', marginTop: '4px', lineHeight: 1.35, textAlign: 'center' }}>
        <div>{refundDesc}</div>
        <div style={{ marginTop: '2px' }}>{refundDetailNode}</div>
      </div>
    )}
  </div>
);

// 手数料率表画面
const FeeTablePage = ({ lang, onBack }: { lang: Lang; onBack: () => void }) => {
  const content = {
    ja: {
      back: "← 戻る",
      title: "【免税手数料率】",
      calcMethodTitle: "手数料\n計算方法",
      calcMethodDesc: "購入金額に応じた手数料率で\n消費税額をもとに計算",
      rateTitle: "料率",
      r1: "100万円未満",
      r2: "100万円以上300万円未満",
      r3: "300万円以上1,000万円未満",
      r4: "1,000万円以上",
      exampleTitle: "(例)",
      exampleText: "税抜500,000円 (税率10%) の場合\n消費税額 50,000円 × 23% ＝ 11,500円"
    },
    'zh-CN': {
      back: "← 返回",
      title: "【免税手续费率】",
      calcMethodTitle: "手续费\n计算方法",
      calcMethodDesc: "根据购买金额对应的手续费率\n基于消费税额计算",
      rateTitle: "费率",
      r1: "100万日元未满",
      r2: "100万日元以上300万日元未满",
      r3: "300万日元以上1,000万日元未满",
      r4: "1,000万日元以上",
      exampleTitle: "(例)",
      exampleText: "不含税500,000日元 (税率10%) 时\n消费税额 50,000日元 × 23% ＝ 11,500日元"
    },
    'zh-TW': {
      back: "← 返回",
      title: "【免稅手續費率】",
      calcMethodTitle: "手續費\n計算方法",
      calcMethodDesc: "根據購買金額對應的手續費率\n基於消費稅額計算",
      rateTitle: "費率",
      r1: "100萬日圓未滿",
      r2: "100萬日圓以上300萬日圓未滿",
      r3: "300萬日圓以上1,000萬日圓未滿",
      r4: "1,000萬日圓以上",
      exampleTitle: "(例)",
      exampleText: "不含稅500,000日圓 (稅率10%) 時\n消費稅額 50,000日圓 × 23% ＝ 11,500日圓"
    },
    en: {
      back: "← Back",
      title: "【Tax Exemption Fee Rate】",
      calcMethodTitle: "Calculation\nMethod",
      calcMethodDesc: "Calculated based on tax amount with rates\naccording to purchase price",
      rateTitle: "Rates",
      r1: "Under 1,000,000 JPY",
      r2: "1M - Under 3M JPY",
      r3: "3M - Under 10M JPY",
      r4: "10,000,000 JPY or more",
      exampleTitle: "(Example)",
      exampleText: "For 500,000 JPY (Tax Excl., 10% Tax)\nTax Amount 50,000 JPY × 23% = 11,500 JPY"
    },
    ko: {
      back: "← 뒤로가기",
      title: "【면세 수수료율】",
      calcMethodTitle: "수수료\n계산 방법",
      calcMethodDesc: "구매 금액에 따른 수수료율로\n소비세액을 기준으로 계산",
      rateTitle: "수수료율",
      r1: "100만 엔 미만",
      r2: "100만 엔 이상 300만 엔 미만",
      r3: "300만 엔 이상 1,000만 엔 미만",
      r4: "1,000만 엔 이상",
      exampleTitle: "(예시)",
      exampleText: "세금 제외 500,000엔 (세율 10%)의 경우\n소비세액 50,000엔 × 23% ＝ 11,500엔"
    }
  }[lang];

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', fontSize: '0.9rem', color: '#000000', backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px', boxSizing: 'border-box' }}>
      <button 
        onClick={onBack} 
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#eeeeee', 
          color: '#000000',
          border: '1px solid #cccccc', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '15px' 
        }}
      >
        {content.back}
      </button>

      <h3 style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '15px', fontWeight: 'bold', color: '#000000' }}>{content.title}</h3>

      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', border: '2px solid #000000', backgroundColor: '#ffffff', color: '#000000' }}>
        <tbody>
          <tr>
            <td style={{ width: '90px', border: '1px solid #000000', padding: '10px 4px', fontWeight: 'bold', textAlign: 'center', whiteSpace: 'pre-line', verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000' }}>
              {content.calcMethodTitle}
            </td>
            <td colSpan={2} style={{ border: '1px solid #000000', padding: '12px 8px', textAlign: 'center', whiteSpace: 'pre-line', fontWeight: '500', verticalAlign: 'middle', lineHeight: 1.4, backgroundColor: '#ffffff', color: '#000000' }}>
              {content.calcMethodDesc}
            </td>
          </tr>
          <tr>
            <td rowSpan={4} style={{ width: '65px', border: '1px solid #000000', padding: '10px 4px', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000' }}>
              {content.rateTitle}
            </td>
            <td style={{ border: '1px solid #000000', padding: '10px 6px', verticalAlign: 'middle', textAlign: 'left', fontSize: lang === 'en' ? '0.78rem' : '0.85rem', backgroundColor: '#ffffff', color: '#000000', wordBreak: 'break-word' }}>
              {content.r1}
            </td>
            <td style={{ width: '60px', border: '1px solid #000000', padding: '10px 4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000' }}>
              23%
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000000', padding: '10px 6px', verticalAlign: 'middle', textAlign: 'left', fontSize: lang === 'en' ? '0.78rem' : '0.85rem', backgroundColor: '#ffffff', color: '#000000', wordBreak: 'break-word' }}>
              {content.r2}
            </td>
            <td style={{ width: '60px', border: '1px solid #000000', padding: '10px 4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000' }}>
              21%
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000000', padding: '10px 6px', verticalAlign: 'middle', textAlign: 'left', fontSize: lang === 'en' ? '0.78rem' : '0.85rem', backgroundColor: '#ffffff', color: '#000000', wordBreak: 'break-word' }}>
              {content.r3}
            </td>
            <td style={{ width: '60px', border: '1px solid #000000', padding: '10px 4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000' }}>
              18%
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000000', padding: '10px 6px', verticalAlign: 'middle', textAlign: 'left', fontSize: lang === 'en' ? '0.78rem' : '0.85rem', backgroundColor: '#ffffff', color: '#000000', wordBreak: 'break-word' }}>
              {content.r4}
            </td>
            <td style={{ width: '60px', border: '1px solid #000000', padding: '10px 4px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000' }}>
              16%
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000000', padding: '10px 4px', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000' }}>
              {content.exampleTitle}
            </td>
            <td colSpan={2} style={{ border: '1px solid #000000', padding: '12px 8px', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.5, verticalAlign: 'middle', backgroundColor: '#ffffff', color: '#000000', fontSize: lang === 'en' ? '0.8rem' : '0.9rem' }}>
              {content.exampleText}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

function App() {
  const [lang, setLang] = useState<Lang>('ja');
  const [inputValue, setInputValue] = useState<string>('1,100,000');
  const [useCoupon, setUseCoupon] = useState<boolean>(true);
  const [page, setPage] = useState<'calc' | 'feeTable'>('calc');

  const taxIncludedPrice = useMemo(() => Number(inputValue.replace(/,/g, '')), [inputValue]);

  const result = useMemo(() => {
    const a = taxIncludedPrice || 0;
    const b = Math.round(a / 1.1);
    
    const c = useCoupon ? Math.round(b * 0.95) : b;
    const d = Math.round(c * 0.1);

    let feeRate = 0.23;
    if (c >= 10000000) {
      feeRate = 0.16;
    } else if (c >= 3000000) {
      feeRate = 0.18;
    } else if (c >= 1000000) {
      feeRate = 0.21;
    }

    const e = Math.round(d * feeRate);
    const f = d - e;
    const g = Math.round(c * 1.1);
    const h = g - f;
    const saved = a - h;
    const feeRatePercent = Math.round(feeRate * 100);

    return { a, b, c, d, e, f, g, h, saved, feeRatePercent };
  }, [taxIncludedPrice, useCoupon]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(rawValue === '' ? '' : rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  };

  const currentItems = useMemo(() => getBaseData(lang, result.feeRatePercent, useCoupon), [lang, result.feeRatePercent, useCoupon]);
  
  // タイトルを「免税計算」に変更（各言語対応）
  const titles = { 
    ja: "免税計算", 
    'zh-CN': "免税计算", 
    'zh-TW': "免稅計算", 
    en: "Tax Exemption Calculation",
    ko: "면세 계산"
  };
  
  const refundDesc = { 
    ja: "※免税される金額", 
    'zh-CN': "※免税金额", 
    'zh-TW': "※免稅金額", 
    en: "※Tax exempt amount",
    ko: "※면세되는 금액"
  };

  const refundDetailNodes: Record<Lang, React.ReactNode> = {
    ja: (
      <>
        <div>空港・港の免税手続端末にてグリーン判定が出て、</div>
        <div>税関の確認が完了した後の日に戻ってくる金額です。</div>
      </>
    ),
    'zh-CN': (
      <>
        <div>在机场/港口退税终端显示绿色判定，</div>
        <div>海关确认完成后日后退还的金额。</div>
      </>
    ),
    'zh-TW': (
      <>
        <div>在機場/港口退稅終端顯示綠色判定，</div>
        <div>海關確認完成後日後退還的金額。</div>
      </>
    ),
    en: (
      <>
        <div>The amount refunded on a later date after obtaining a green status</div>
        <div>at the airport/port kiosk and completing customs verification.</div>
      </>
    ),
    ko: (
      <>
        <div>공항·항구의 면세 단말기에서 녹색 판정이 나오고,</div>
        <div>세관 확인이 완료된 후 추후 환급되는 금액입니다.</div>
      </>
    )
  };

  const linkStyle = { color: APP_RED, textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' };
  const openTable = () => setPage('feeTable');

  const feeDescNodes: Record<Lang, React.ReactNode> = {
    ja: (
      <>※店舗、金額により<span style={linkStyle} onClick={openTable}>手数料率</span>はかわります。</>
    ),
    'zh-CN': (
      <>※根据店铺和金额，<span style={linkStyle} onClick={openTable}>手续费率</span>有所不同。</>
    ),
    'zh-TW': (
      <>※根據店舖和金額，<span style={linkStyle} onClick={openTable}>手續費率</span>有所不同。</>
    ),
    en: (
      <>*Service fee <span style={linkStyle} onClick={openTable}>rates</span> vary by store and amount.</>
    ),
    ko: (
      <>※매장 및 금액에 따라 <span style={linkStyle} onClick={openTable}>수수료율</span>이 변동됩니다.</>
    )
  };

  const footerNotices: Record<Lang, { line1: string; line2: string; line3: string; line3Notice: string }> = {
    ja: {
      line1: "購入された当日中に",
      line2: "当店の免税カウンターにて",
      line3: "免税手続きをしてください。",
      line3Notice: "※免税手続き後の返品は\n原則お断りさせていただきます。"
    },
    'zh-CN': {
      line1: "购买后请务必于当天内",
      line2: "在本店的退税柜台",
      line3: "办理退税手续。",
      line3Notice: "※原则上谢绝在办理退税手续后\n进行退货。"
    },
    'zh-TW': {
      line1: "購買後請務必於當天內",
      line2: "在本店的退稅櫃檯",
      line3: "辦理退稅手續。",
      line3Notice: "※原則上謝絕在辦理退稅手續後\n進行退貨。"
    },
    en: {
      line1: "Please be sure to complete tax-free procedures",
      line2: "at our tax-free counter",
      line3: "on the same day of purchase.",
      line3Notice: "*As a general rule, returns are not accepted\nafter tax-free procedures have been completed."
    },
    ko: {
      line1: "구매하신 당일 내에",
      line2: "당사 매장 면세 카운터에서",
      line3: "면세 수속을 진행해 주십시오.",
      line3Notice: "※면세 수속 후의 환불은\n원칙적으로 불가합니다."
    }
  };

  const showNotice = result.b >= 1000000;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', padding: '15px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#000000' }}>
      <div style={{ width: '100%', maxWidth: '450px', fontSize: '1rem', boxSizing: 'border-box' }}>
        {/* 言語切替ボタン */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
          {[ 
            { id: 'ja', label: '日本語' }, 
            { id: 'zh-CN', label: '简体' }, 
            { id: 'zh-TW', label: '繁體' }, 
            { id: 'en', label: 'English' },
            { id: 'ko', label: '한국어' }
          ].map(item => (
            <button key={item.id} onClick={() => setLang(item.id as Lang)} style={{ flex: 1, padding: '10px 0', cursor: 'pointer', backgroundColor: lang === item.id ? '#555555' : '#eeeeee', color: lang === item.id ? '#ffffff' : '#000000', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>{item.label}</button>
          ))}
        </div>

        {page === 'feeTable' ? (
          <FeeTablePage lang={lang} onBack={() => setPage('calc')} />
        ) : (
          <>
            <h2 style={{ fontSize: '1.5rem', textAlign: 'center', margin: '0 0 20px 0', whiteSpace: 'pre-line', color: '#000000' }}>{titles[lang]}</h2>

            <div style={{ border: '2px solid #cccccc', padding: '15px', borderRadius: '10px', backgroundColor: '#ffffff', color: '#000000', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '2px solid #888888', alignItems: 'center' }}>
                <span style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem', color: '#000000', textAlign: 'center' }}>{currentItems[0][0].text}</span>
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    pattern="[0-9]*" 
                    autoCorrect="off" 
                    autoComplete="off" 
                    spellCheck={false}
                    value={inputValue} 
                    onChange={handleInputChange} 
                    style={{ width: '110px', textAlign: 'right', fontSize: '1.1rem', padding: '5px', backgroundColor: '#ffffff', color: '#000000', border: '1px solid #cccccc', borderRadius: '4px' }} 
                  />
                  <RedCode code="(a)" />
                </div>
              </div>

              <Row 
                labelParts={currentItems[1]} 
                value={result.b} 
                code="(b)" 
                showNotice={showNotice} 
              />
              
              <Row 
                labelParts={currentItems[2]} 
                value={result.c} 
                code="(c)" 
                isCouponRow={true} 
                useCoupon={useCoupon} 
                setUseCoupon={setUseCoupon} 
              />

              <Row labelParts={currentItems[3]} value={result.d} code="(d)" />
              
              <Row 
                labelParts={currentItems[4]} 
                value={result.e} 
                code="(e)" 
                isFeeRow={true} 
                feeDescNode={feeDescNodes[lang]} 
              />
              
              <Row 
                labelParts={currentItems[5]} 
                value={result.f} 
                code="(f)" 
                isRefund={true} 
                refundDesc={refundDesc[lang]} 
                refundDetailNode={refundDetailNodes[lang]} 
              />
              
              <div style={{ border: `3px solid ${APP_RED}`, padding: '10px', borderRadius: '8px', margin: '10px 0', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
                <Row labelParts={currentItems[6]} value={result.g} code="(g)" emphasize={true} />
              </div>
              
              <Row labelParts={currentItems[7]} value={result.h} code="(h)" isFinal={true} />
              <Row labelParts={currentItems[8]} value={result.saved} code="" />

              <div style={{ marginTop: '18px', borderTop: '1px solid #dddddd', paddingTop: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#000000', lineHeight: 1.5, marginBottom: '8px' }}>
                  <div>{footerNotices[lang].line1}</div>
                  <div>{footerNotices[lang].line2}</div>
                  <div>{footerNotices[lang].line3}</div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: APP_RED, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {footerNotices[lang].line3Notice}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;