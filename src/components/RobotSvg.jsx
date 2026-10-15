import { TIERS } from '../lib/robot.js'

// Robot raksasa digambar dari bagian-bagian SVG. Makin tinggi tingkat, makin besar & bercahaya.
export default function RobotSvg({ robot = {}, selected, onSelect, bump }) {
  const t = (id) => robot[id] || 0
  const col = (id) => TIERS[t(id)].color
  const g = (id, cx, cy, children) => {
    const k = t(id)
    const s = 1 + k * 0.07
    return (
      <g
        key={id}
        className={`rpart ${selected === id ? 'sel' : ''} ${bump === id ? 'bump' : ''} ${k === 0 ? 'ghost' : ''}`}
        style={{ filter: k >= 3 ? `drop-shadow(0 0 ${k * 3}px ${col(id)})` : undefined, transformOrigin: `${cx}px ${cy}px` }}
        transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}
        onClick={() => onSelect?.(id)}
      >
        {children}
      </g>
    )
  }
  const stroke = '#0f172a'
  const P = { stroke, strokeWidth: 4, strokeLinejoin: 'round' }

  return (
    <svg viewBox="0 0 340 440" className="robot-svg" role="img" aria-label="Robot">
      <ellipse cx="170" cy="425" rx="120" ry="10" fill="#000" opacity=".35" />

      {g('back', 170, 190, <>
        <polygon points="85,150 20,90 50,205 85,215" fill={col('back')} {...P} />
        <polygon points="255,150 320,90 290,205 255,215" fill={col('back')} {...P} />
        {t('back') >= 2 && <>
          <polygon points="70,170 35,130 55,190" fill="#fff" opacity=".35" />
          <polygon points="270,170 305,130 285,190" fill="#fff" opacity=".35" />
        </>}
      </>)}

      {g('legs', 170, 350, <>
        <rect x="100" y="295" width="50" height="95" rx="10" fill={col('legs')} {...P} />
        <rect x="190" y="295" width="50" height="95" rx="10" fill={col('legs')} {...P} />
        <rect x="88" y="385" width="74" height="26" rx="8" fill={col('legs')} {...P} />
        <rect x="178" y="385" width="74" height="26" rx="8" fill={col('legs')} {...P} />
        {t('legs') >= 2 && <>
          <rect x="112" y="320" width="26" height="8" rx="4" fill="#fff" opacity=".4" />
          <rect x="202" y="320" width="26" height="8" rx="4" fill="#fff" opacity=".4" />
        </>}
      </>)}

      {g('armL', 62, 215, <>
        <circle cx="75" cy="165" r="24" fill={col('armL')} {...P} />
        <rect x="38" y="165" width="48" height="115" rx="14" fill={col('armL')} {...P} />
        <circle cx="62" cy="290" r="22" fill={col('armL')} {...P} />
        {t('armL') >= 3 && <rect x="48" y="190" width="28" height="10" rx="5" fill="#fff" opacity=".45" />}
      </>)}

      {g('body', 170, 215, <>
        <rect x="88" y="150" width="164" height="150" rx="26" fill={col('body')} {...P} />
        <rect x="108" y="270" width="124" height="18" rx="8" fill="#000" opacity=".2" />
        {t('body') >= 2 && <path d="M105 165 H235" stroke="#fff" strokeWidth="6" opacity=".35" strokeLinecap="round" />}
        {t('body') >= 4 && <path d="M170 150 V195" stroke="#fff" strokeWidth="5" opacity=".35" />}
      </>)}

      {g('core', 170, 225, <>
        <circle cx="170" cy="225" r="30" fill="#0f172a" {...P} />
        <circle cx="170" cy="225" r="20" fill={col('core')} className={t('core') > 0 ? 'pulse' : ''} />
        {t('core') >= 2 && <circle cx="170" cy="225" r="9" fill="#fff" opacity=".8" />}
      </>)}

      {g('armR', 278, 215, <>
        <circle cx="265" cy="165" r="24" fill={col('armR')} {...P} />
        <rect x="254" y="165" width="48" height="115" rx="14" fill={col('armR')} {...P} />
        <circle cx="278" cy="290" r="22" fill={col('armR')} {...P} />
        {t('armR') >= 3 && <rect x="264" y="190" width="28" height="10" rx="5" fill="#fff" opacity=".45" />}
      </>)}

      {g('weapon', 300, 320, <>
        <rect x="288" y="285" width="26" height="88" rx="8" fill={col('weapon')} {...P} />
        <rect x="293" y="372" width="16" height="14" rx="3" fill="#0f172a" />
        {t('weapon') >= 2 && <rect x="283" y="300" width="36" height="14" rx="5" fill={col('weapon')} {...P} />}
        {t('weapon') >= 4 && <circle cx="301" cy="393" r="9" fill="#fff" opacity=".85" className="pulse" />}
      </>)}

      {g('head', 170, 100, <>
        <line x1="170" y1="62" x2="170" y2="38" stroke={stroke} strokeWidth="5" />
        <circle cx="170" cy="32" r="9" fill={col('head')} {...P} className={t('head') >= 2 ? 'pulse' : ''} />
        <rect x="120" y="62" width="100" height="84" rx="22" fill={col('head')} {...P} />
        <rect x="132" y="86" width="76" height="30" rx="12" fill="#0f172a" />
        <circle cx="152" cy="101" r="8" fill={t('head') ? '#67e8f9' : '#334155'} className={t('head') ? 'pulse' : ''} />
        <circle cx="188" cy="101" r="8" fill={t('head') ? '#67e8f9' : '#334155'} className={t('head') ? 'pulse' : ''} />
        {t('head') >= 3 && <>
          <polygon points="125,70 100,40 140,64" fill={col('head')} {...P} />
          <polygon points="215,70 240,40 200,64" fill={col('head')} {...P} />
        </>}
      </>)}
    </svg>
  )
}
