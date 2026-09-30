// Scene illustration, ported from design/Screen.dc.html (viewBox 0 0 326 440).
// Colors are classes (styles/scene.css → tokens.css), never raw values.
// `data-when="<states>"` shows a part only in those scene states (see scene.ts);
// `.news` parts only when the news switch is on. The design's variant b/c high poses are
// not ported. Its SMIL loops are CSS keyframes in styles/scene.css (ANIMATIONS.md §A).
export const sceneMarkup = /* svg */ `
<defs>
  <clipPath id="panelclip"><rect x="10" y="40" width="306" height="390" rx="24" /></clipPath>
  <radialGradient id="tvglow" cx="0" cy="0.5" r="1">
    <stop offset="0" class="glow-inner" stop-opacity="0.55" />
    <stop offset="0.55" class="glow-outer" stop-opacity="0.18" />
    <stop offset="1" class="glow-outer" stop-opacity="0" />
  </radialGradient>
</defs>

<g id="backdrop">
  <rect class="f-scene" x="10" y="40" width="306" height="390" rx="24" />
  <g clip-path="url(#panelclip)">
    <rect class="f-floor" x="10" y="352" width="306" height="80" />
    <rect id="tv-glow" class="news" x="10" y="40" width="200" height="390" fill="url(#tvglow)" />
  </g>
  <rect class="panel-border" x="10" y="40" width="306" height="390" rx="24" />
  <circle class="f-orange" cx="290" cy="240" r="2.5" />
  <circle class="f-orange" cx="220" cy="80" r="2" />
  <circle class="f-cream" cx="36" cy="300" r="1.8" />
  <circle class="f-cream" cx="300" cy="120" r="1.8" />
</g>

<g id="moon">
  <g class="s-ink" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
    <circle class="f-cream" cx="64" cy="98" r="30" />
    <g id="moon-eyes-open" data-when="idle checking high medium">
      <ellipse class="f-white" cx="56" cy="94" rx="8" ry="10" />
      <ellipse class="f-white" cx="74" cy="94" rx="8" ry="10" />
    </g>
    <path id="moon-eyes-closed" data-when="low" d="M49 95 Q56 101 63 95 M67 95 Q74 101 81 95" fill="none" stroke-width="3" />
    <path id="moon-smile" data-when="idle checking low" d="M56 112 Q64 118 72 112" fill="none" stroke-width="3" />
    <path id="moon-worried" data-when="high medium" d="M56 116 Q64 110 72 116" fill="none" stroke-width="3" />
  </g>
  <g id="moon-pupils" data-when="idle checking high medium">
    <circle class="f-ink" cx="59" cy="90" r="4" />
    <circle class="f-ink" cx="77" cy="90" r="4" />
  </g>
  <g id="moon-z" class="f-cream zz" data-when="low">
    <text x="96" y="76" font-size="11">z</text>
    <text x="106" y="64" font-size="14">z</text>
  </g>
</g>

<g id="standing" data-when="idle checking">
  <g class="s-ink" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
    <g id="thought">
      <path class="f-cream" d="M166 176 Q156 150 180 140 Q196 118 226 128 Q254 124 262 150 Q284 166 266 186 Q260 208 232 204 Q208 216 190 200 Q164 200 166 176 Z" />
      <circle class="f-cream" cx="160" cy="214" r="7" />
      <circle class="f-cream" cx="150" cy="232" r="4.5" />
      <g id="thought-bed" data-when="idle">
        <path d="M186 150 L186 188" fill="none" stroke-width="5" />
        <rect class="f-wood" x="186" y="170" width="66" height="14" rx="4" />
        <ellipse class="f-white" cx="202" cy="165" rx="10" ry="6" />
        <rect class="f-blanket" x="214" y="159" width="38" height="14" rx="5" />
        <path d="M190 184 L190 192 M248 184 L248 192" fill="none" stroke-width="3.5" />
      </g>
    </g>
    <ellipse class="f-shadow" cx="120" cy="412" rx="96" ry="10" stroke="none" />
    <path id="hair-back" class="f-hair" d="M78 214 Q72 168 118 162 Q164 158 166 212 Q170 264 150 296 L90 296 Q72 262 78 214 Z" />
    <path id="neck" class="f-skin" d="M110 256 L130 256 L132 274 L108 274 Z" />
    <path id="legs" class="f-pants" d="M88 350 L152 350 L154 404 L126 404 L120 372 L114 404 L86 404 Z" />
    <path id="torso" class="f-pajamas" d="M92 274 Q120 262 148 274 Q158 312 156 354 Q120 362 84 354 Q82 312 92 274 Z" />
    <g id="arm-down">
      <path class="s-pajamas" d="M94 284 Q78 318 84 346" fill="none" stroke-width="15" />
      <circle class="f-skin" cx="84" cy="349" r="8" />
    </g>
    <path id="arm-up" class="s-pajamas" d="M146 284 Q170 302 144 266" fill="none" stroke-width="15" />
    <g id="feet">
      <path class="f-orange" d="M84 410 Q84 398 102 400 Q114 404 112 414 Q98 418 84 410 Z" />
      <path class="f-orange" d="M128 414 Q126 404 138 400 Q156 398 156 410 Q142 418 128 414 Z" />
    </g>
    <g id="head">
      <circle class="f-skin" cx="120" cy="212" r="44" />
      <path class="f-hair" d="M76 206 Q80 162 120 162 Q162 162 166 204 Q146 184 120 194 Q98 182 76 206 Z" />
      <ellipse class="f-white" cx="104" cy="216" rx="12" ry="14" />
      <ellipse class="f-white" cx="136" cy="216" rx="12" ry="14" />
      <path d="M112 244 Q120 250 128 243" fill="none" stroke-width="3" />
    </g>
    <circle id="hand-chin" class="f-skin" cx="144" cy="258" r="9" />
    <g id="ghost">
      <path class="f-cream" d="M262 330 Q262 300 290 304 Q312 310 306 340 Q300 366 272 360 Q256 352 262 330 Z" />
      <ellipse class="f-white" cx="278" cy="330" rx="7" ry="8" />
      <ellipse class="f-white" cx="294" cy="330" rx="7" ry="8" />
      <path d="M280 346 Q286 350 292 346" fill="none" stroke-width="3" />
    </g>
  </g>
  <g id="thought-dots" class="f-scene" data-when="checking">
    <circle cx="200" cy="166" r="8" />
    <circle cx="222" cy="166" r="8" />
    <circle cx="244" cy="166" r="8" />
  </g>
  <g id="pupils" class="f-ink">
    <circle cx="109" cy="209" r="6" />
    <circle cx="141" cy="209" r="6" />
    <circle cx="280" cy="326" r="3.5" />
    <circle cx="296" cy="326" r="3.5" />
  </g>
  <g class="f-white">
    <circle cx="111" cy="207" r="1.8" />
    <circle cx="143" cy="207" r="1.8" />
  </g>
  <g id="freckles" class="f-freckle">
    <circle cx="94" cy="232" r="1.5" />
    <circle cx="99" cy="236" r="1.5" />
    <circle cx="141" cy="236" r="1.5" />
    <circle cx="146" cy="232" r="1.5" />
  </g>
  <path id="stripes" class="s-cream" d="M102 300 L138 300 M100 322 L140 322" stroke-width="5" stroke-linecap="round" />
</g>

<g id="lying" data-when="high medium low">
  <g id="iron-dome" clip-path="url(#panelclip)" data-when="high medium">
    <path class="f-hill" d="M10 252 Q80 236 160 244 Q240 252 316 238 L316 352 L10 352 Z" />
    <g id="truck" transform="translate(160 212)">
      <g class="s-ink" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
        <g id="launcher" data-when="high" transform="translate(30 12) rotate(-60)">
          <rect class="f-battery" x="0" y="-22" width="34" height="22" rx="3" />
          <g class="f-cream" stroke-width="1.8">
            <circle cx="8" cy="-15" r="3" />
            <circle cx="17" cy="-15" r="3" />
            <circle cx="26" cy="-15" r="3" />
            <circle cx="8" cy="-7" r="3" />
            <circle cx="17" cy="-7" r="3" />
            <circle cx="26" cy="-7" r="3" />
          </g>
        </g>
        <g id="radar" data-when="medium">
          <path d="M38 12 L38 -8" fill="none" />
          <g transform="translate(38 -12)">
            <g id="radar-dish">
              <path class="f-cream" d="M-13 -3 Q0 11 13 -3 Z" />
              <path d="M0 3 L4 -8" fill="none" stroke-width="2" />
              <circle class="f-orange" cx="4" cy="-9" r="2" stroke-width="1.5" />
            </g>
          </g>
        </g>
        <rect class="f-battery" x="0" y="12" width="62" height="14" rx="3" />
        <path class="f-battery" d="M0 26 L0 8 Q0 2 -5 2 L-13 2 Q-19 2 -19 9 L-19 26 Z" />
        <rect class="f-cream" x="-15" y="6" width="9" height="7" rx="1.5" stroke-width="1.8" />
        <g class="f-ink">
          <circle cx="-10" cy="28" r="6" />
          <circle cx="10" cy="28" r="6" />
          <circle cx="30" cy="28" r="6" />
          <circle cx="50" cy="28" r="6" />
        </g>
      </g>
      <g class="f-cream">
        <circle cx="-10" cy="28" r="2" />
        <circle cx="10" cy="28" r="2" />
        <circle cx="30" cy="28" r="2" />
        <circle cx="50" cy="28" r="2" />
      </g>
      <!-- Interceptor: invisible at rest (styles/scene.css launches it). -->
      <g id="interceptor" data-when="high">
        <circle id="launch-puff" class="f-cream" cx="38" cy="-23" r="3" />
        <g id="missile" transform="translate(38 -23)">
          <g transform="rotate(14)" class="s-ink" stroke-width="1.8" stroke-linejoin="round">
            <path id="missile-flame" class="f-orange" d="M-2.5 2 Q0 14 2.5 2 Z" stroke="none" />
            <path class="f-hair" d="M-3 -2 L-7 4 L-3 2 Z M3 -2 L7 4 L3 2 Z" />
            <rect class="f-white" x="-3" y="-16" width="6" height="18" rx="3" />
            <path class="f-hair" d="M-3 -14 Q0 -23 3 -14 Z" />
          </g>
        </g>
      </g>
    </g>
  </g>

  <g class="s-ink" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
    <g id="nightstand">
      <rect class="f-wood" x="244" y="290" width="58" height="64" rx="4" />
      <path d="M252 322 L294 322" fill="none" stroke-width="2.5" />
      <circle class="f-ink" cx="273" cy="338" r="3" stroke="none" />
      <rect class="f-wood-dark" x="286" y="278" width="10" height="12" />
      <path class="f-orange" d="M280 278 L302 278 L296 254 L286 254 Z" />
    </g>
    <g id="bed">
      <rect class="f-wood" x="22" y="250" width="14" height="110" rx="4" />
      <rect class="f-wood-dark" x="30" y="350" width="8" height="18" />
      <rect class="f-wood-dark" x="224" y="350" width="8" height="18" />
      <rect class="f-wood" x="22" y="340" width="218" height="14" rx="3" />
      <rect class="f-cream" x="30" y="316" width="210" height="28" rx="7" />
      <path id="pillow" class="f-white" d="M40 306 Q40 288 70 288 Q112 288 114 306 Q114 324 76 324 Q40 324 40 306 Z" />
    </g>
    <path id="hair-spread" class="f-hair" d="M66 294 Q44 296 42 312 Q44 318 60 318 L80 316 Z" />
    <path id="body" class="f-pajamas" d="M100 318 L100 302 Q110 298 118 296 Q128 288 138 291 Q146 294 150 298 Q158 300 164 300 L168 318 Z" />
    <g id="blanket">
      <path class="f-blanket" d="M156 318 Q154 294 178 290 Q214 286 234 298 Q242 308 240 318 Z" />
      <path d="M190 296 Q204 304 220 298" fill="none" stroke-width="2.5" />
    </g>
    <g id="head-lying">
      <circle class="f-skin" cx="80" cy="292" r="22" />
      <path class="f-hair" d="M80 270 Q57 272 58 293 Q59 312 80 314 Q67 306 67 292 Q67 278 80 270 Z" />
      <circle id="ear" class="f-skin" cx="71" cy="295" r="4.5" stroke-width="2.4" />
    </g>
    <g id="face-high" data-when="high">
      <path d="M79 274 L89 277" fill="none" stroke-width="2.6" />
      <path d="M94 288 Q97.5 284.5 101 288" fill="none" stroke-width="2.4" />
    </g>
    <ellipse id="eye-white-medium" class="f-white" data-when="medium" cx="85" cy="281" rx="4.8" ry="5.8" stroke-width="2" />
    <g id="face-low" data-when="low">
      <path d="M80 283 Q84 278 88 283" fill="none" stroke-width="2.6" />
      <path d="M93 285 Q97 290 101 284" fill="none" stroke-width="2.4" />
    </g>
  </g>
  <g class="f-freckle">
    <circle cx="90" cy="291" r="1.3" />
    <circle cx="93" cy="295" r="1.3" />
  </g>

  <g id="high" data-when="high">
    <g id="eye-crying">
      <ellipse class="f-white s-ink" cx="85" cy="281" rx="4.8" ry="5.8" stroke-width="2" />
      <circle class="f-ink" cx="86" cy="280" r="2.6" />
      <circle class="f-white" cx="86.8" cy="279" r="0.9" />
    </g>
    <path id="tear" class="s-tear" d="M83 287 Q80 298 76 312" fill="none" stroke-width="3" stroke-linecap="round" />
    <path id="bra-under-shirt" class="f-pajamas-bra" d="M108 305 Q110 298 118 296.5 Q128 289 138 292 Q145 294.5 148 299 L148 306 Q128 303 108 305 Z" />
    <path class="tired s-freckle" d="M80.5 290 Q85 292.5 89.5 290 M82 293.3 Q85 294.9 88 293.3" fill="none" stroke-width="1.5" stroke-linecap="round" />
  </g>
  <path id="stripe-lying" class="s-cream" d="M148 301 L148 312" fill="none" stroke-width="5" stroke-linecap="round" />

  <g id="medium" data-when="medium">
    <g id="eye-sleepy">
      <circle class="f-ink" cx="97.5" cy="287" r="2.3" />
      <circle class="f-ink" cx="86.5" cy="280.2" r="2.3" />
      <path class="f-skin" d="M79 279.2 Q85 277.2 91 279.2 Q91 274 85 274 Q79 274 79 279.2 Z" />
      <path class="s-ink" d="M79.4 279.4 Q85 277.4 90.6 279.4" fill="none" stroke-width="2.6" stroke-linecap="round" />
    </g>
    <path class="tired s-freckle" d="M80.5 289.5 Q85 292 89.5 289.5 M82 292.8 Q85 294.4 88 292.8" fill="none" stroke-width="1.5" stroke-linecap="round" />
    <g id="sighs" class="f-cream s-ink">
      <circle cx="104" cy="270" r="3.5" stroke-width="2" />
      <circle cx="111" cy="255" r="5.5" stroke-width="2.2" />
      <circle cx="121" cy="237" r="8.5" stroke-width="2.5" />
    </g>
    <g id="bra-floor" class="s-ink" transform="translate(92 368) rotate(-6)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M2 2 Q4 -10 8 -12 M30 2 Q28 -10 24 -12" fill="none" />
      <path class="f-bra" d="M0 2 Q0 14 10 14 Q15 14 16 7 Q17 14 22 14 Q32 14 32 2 Z" />
    </g>
    <g id="arm-dangle">
      <path class="s-ink" d="M112 304 Q107 318 112 330" fill="none" stroke-width="14" stroke-linecap="round" />
      <path class="s-pajamas" d="M112 304 Q107 318 112 330" fill="none" stroke-width="9" stroke-linecap="round" />
      <circle class="f-skin s-ink" cx="113" cy="335" r="6" stroke-width="2.4" />
    </g>
  </g>

  <g id="low" data-when="low">
    <g id="zzz" class="f-cream zz">
      <text x="126" y="262" font-size="14">z</text>
      <text x="138" y="246" font-size="18">z</text>
      <text x="154" y="226" font-size="22">Z</text>
    </g>
    <mask id="bra-trail-mask" maskUnits="userSpaceOnUse">
      <path id="bra-trail-reveal" class="s-white" d="M170 282 Q190 200 214 176" fill="none" stroke-width="8" pathLength="100" />
    </mask>
    <path id="bra-trail" class="s-cream" d="M170 282 Q190 200 214 176" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 6" mask="url(#bra-trail-mask)" />
    <!-- Pivot at the bra's center, so CSS can spin it in place; the rest pose
         (styles/scene.css) equals the design's translate(212 150) rotate(-28). -->
    <g id="bra-flying">
      <g class="s-ink" transform="translate(-18 -2)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
        <path d="M2 2 Q4 -12 8 -15 M34 2 Q32 -12 28 -15" fill="none" />
        <path class="f-bra" d="M0 2 Q0 16 11 16 Q17 16 18 8 Q19 16 25 16 Q36 16 36 2 Z" />
      </g>
    </g>
    <g id="sparkles" class="f-orange">
      <path id="sparkle-big" d="M258 150 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" />
      <path id="sparkle-small" d="M196 116 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" />
    </g>
  </g>
</g>

<g id="news-bubble" class="news">
  <path class="f-bubble s-ink" d="M28 134 L100 134 Q110 134 110 144 L110 162 Q110 172 100 172 L40 172 L14 184 L26 170 Q20 168 20 160 L20 144 Q20 134 28 134 Z" stroke-width="3" stroke-linejoin="round" />
  <text id="news-text" class="f-scene" x="65" y="159" text-anchor="middle" font-size="15" font-weight="800"></text>
</g>
`;
