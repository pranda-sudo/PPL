window.ICAO_DATA = {
  "vocabulary": [
    {
      "id": "v1",
      "en": "runway",
      "cs": "dráha",
      "why": "Vzletová a přistávací dráha; nezaměňovat s taxiway.",
      "example": "The runway is occupied."
    },
    {
      "id": "v2",
      "en": "taxiway",
      "cs": "pojezdová dráha",
      "why": "Slouží k pojíždění, nikoliv ke vzletu a přistání.",
      "example": "Taxi via Alpha."
    },
    {
      "id": "v3",
      "en": "holding point",
      "cs": "vyčkávací místo",
      "why": "Místo, kde letadlo čeká před vstupem na dráhu.",
      "example": "Hold at the runway holding point."
    },
    {
      "id": "v4",
      "en": "clearance",
      "cs": "povolení ATC",
      "why": "Letové povolení či pokyn; před provedením se ujisti, že mu rozumíš.",
      "example": "We are waiting for clearance."
    },
    {
      "id": "v5",
      "en": "readback",
      "cs": "zopakování pokynu",
      "why": "Zpětné přečtení důležitých částí povolení pro kontrolu porozumění.",
      "example": "Please read back the clearance."
    },
    {
      "id": "v6",
      "en": "heading",
      "cs": "kurz",
      "why": "Směr podélné osy letadla vzhledem k severu.",
      "example": "Turn right heading 180."
    },
    {
      "id": "v7",
      "en": "altitude",
      "cs": "nadmořská výška",
      "why": "Výška vztažená ke střední hladině moře při odpovídajícím nastavení výškoměru.",
      "example": "Maintain altitude 3000 feet."
    },
    {
      "id": "v8",
      "en": "climb",
      "cs": "stoupat",
      "why": "Zvyšovat letovou výšku.",
      "example": "Climb to 4000 feet."
    },
    {
      "id": "v9",
      "en": "descend",
      "cs": "klesat",
      "why": "Snižovat letovou výšku.",
      "example": "Descend to 2500 feet."
    },
    {
      "id": "v10",
      "en": "traffic",
      "cs": "provoz / jiné letadlo",
      "why": "Ve spojení traffic information může jít o upozornění na ostatní provoz.",
      "example": "Traffic at your two o'clock."
    },
    {
      "id": "v11",
      "en": "visibility",
      "cs": "dohlednost",
      "why": "Vzdálenost, na kterou lze rozeznat objekty podle daných podmínek.",
      "example": "Visibility is five kilometres."
    },
    {
      "id": "v12",
      "en": "crosswind",
      "cs": "boční vítr",
      "why": "Vítr s boční složkou vůči dráze nebo směru letu.",
      "example": "We have strong crosswind."
    },
    {
      "id": "v13",
      "en": "tailwind",
      "cs": "zadní vítr",
      "why": "Vítr vanoucí převážně ve směru pohybu letadla.",
      "example": "Expect a tailwind on final."
    },
    {
      "id": "v14",
      "en": "headwind",
      "cs": "protivítr",
      "why": "Vítr vanoucí proti směru pohybu letadla.",
      "example": "There is a headwind on approach."
    },
    {
      "id": "v15",
      "en": "turbulence",
      "cs": "turbulence",
      "why": "Nepravidelné pohyby vzduchu způsobující otřesy letadla.",
      "example": "We are experiencing turbulence."
    },
    {
      "id": "v16",
      "en": "go-around",
      "cs": "nezdařené přiblížení / opakování okruhu",
      "why": "Přerušení přistání a přechod do stoupání podle platného postupu.",
      "example": "Going around."
    },
    {
      "id": "v17",
      "en": "divert",
      "cs": "odklonit let",
      "why": "Zamířit na jiné vhodné letiště kvůli počasí či jiné příčině.",
      "example": "We need to divert."
    },
    {
      "id": "v18",
      "en": "fuel endurance",
      "cs": "vytrvalost letu podle paliva",
      "why": "Přibližná zbývající doba letu dostupná s aktuálním palivem.",
      "example": "Fuel endurance is one hour."
    },
    {
      "id": "v19",
      "en": "engine failure",
      "cs": "vysazení motoru",
      "why": "Ztráta funkce motoru; závažná situace vyžadující prioritní řešení.",
      "example": "We have an engine failure."
    },
    {
      "id": "v20",
      "en": "precautionary landing",
      "cs": "preventivní přistání",
      "why": "Přistání z opatrnosti před tím, než se problém zhorší.",
      "example": "We are considering a precautionary landing."
    },
    {
      "id": "v21",
      "en": "unable",
      "cs": "nemohu splnit",
      "why": "Oznamuje ATC, že pilot nedokáže provést daný pokyn.",
      "example": "Unable due to weather."
    },
    {
      "id": "v22",
      "en": "say again",
      "cs": "opakujte",
      "why": "Žádost o opakování zprávy, která nebyla správně zachycena.",
      "example": "Say again the altitude."
    },
    {
      "id": "v23",
      "en": "stand by",
      "cs": "vyčkejte",
      "why": "Požadavek na krátké vyčkání; sám o sobě není povolením.",
      "example": "Stand by."
    },
    {
      "id": "v24",
      "en": "affirm",
      "cs": "ano / potvrzuji",
      "why": "Standardní jednoznačné potvrzení.",
      "example": "Affirm."
    },
    {
      "id": "v25",
      "en": "negative",
      "cs": "ne / záporně",
      "why": "Jednoznačné zamítnutí nebo zápor.",
      "example": "Negative."
    },
    {
      "id": "v26",
      "en": "wilco",
      "cs": "rozumím a provedu",
      "why": "Znamená, že zpráva byla přijata, pochopena a bude provedena; nenahrazuje povinný readback.",
      "example": "Wilco."
    },
    {
      "id": "v27",
      "en": "roger",
      "cs": "zprávu jsem přijal",
      "why": "Potvrzuje přijetí zprávy, nikoliv automaticky souhlas či provedení.",
      "example": "Roger."
    },
    {
      "id": "v28",
      "en": "squawk",
      "cs": "nastavte kód odpovídače",
      "why": "Používá se při zadávání kódu SSR transpondéru.",
      "example": "Squawk 7000."
    },
    {
      "id": "v29",
      "en": "final approach",
      "cs": "finální přiblížení",
      "why": "Závěrečná část přiblížení k přistání.",
      "example": "We are on final approach."
    },
    {
      "id": "v30",
      "en": "wind shear",
      "cs": "střih větru",
      "why": "Rychlá změna rychlosti či směru větru, zvlášť nebezpečná nízko nad zemí.",
      "example": "We encountered wind shear."
    }
  ],
  "radio": [
    {
      "id": "r1",
      "prompt": "Neslyšel jsi výšku, kterou ti ATC přidělilo. Co odpovíš?",
      "correct": "Say again the altitude, please.",
      "options": [
        "Wilco.",
        "Say again the altitude, please.",
        "Cleared for take-off."
      ],
      "why": "Nedoplňuj si údaj odhadem. Požádej o opakování konkrétní části zprávy."
    },
    {
      "id": "r2",
      "prompt": "ATC tě žádá o stoupání, ale kvůli námraze to bezpečně nezvládneš.",
      "correct": "Unable to climb due to icing.",
      "options": [
        "Unable to climb due to icing.",
        "Roger, climbing.",
        "We are cleared to land."
      ],
      "why": "„Unable“ jednoznačně říká, že pokyn nelze provést; stručně uveď důvod a požádej o alternativu."
    },
    {
      "id": "r3",
      "prompt": "Dostaneš pokyn „Hold short of runway 27“. Co je správná reakce?",
      "correct": "Hold short of runway 27.",
      "options": [
        "Crossing runway 27.",
        "Hold short of runway 27.",
        "Taking off runway 27."
      ],
      "why": "Vyčkávej před hranicí dráhy a nezajížděj na ni bez příslušného povolení; pokyn zopakuj."
    },
    {
      "id": "r4",
      "prompt": "Řídící ti řekne „Stand by“. Co to znamená?",
      "correct": "Vyčkat na další zprávu.",
      "options": [
        "Povolení k pojíždění.",
        "Vyčkat na další zprávu.",
        "Povolení ke vzletu."
      ],
      "why": "Stand by samo o sobě není žádné povolení."
    },
    {
      "id": "r5",
      "prompt": "Při letu se dostaneš do turbulence a chceš změnit výšku.",
      "correct": "Request a different altitude due to turbulence.",
      "options": [
        "Request a different altitude due to turbulence.",
        "Runway is clear.",
        "Roger, no change."
      ],
      "why": "Zpráva má uvést záměr a důvod; případnou změnu výšky koordinuj s ATC."
    },
    {
      "id": "r6",
      "prompt": "Dostáváš zprávu, kterou jsi slyšel, ale nechápeš její význam.",
      "correct": "Confirm your instruction, please.",
      "options": [
        "Roger.",
        "Confirm your instruction, please.",
        "Wilco."
      ],
      "why": "Nestačí pouze potvrdit příjem. Vyžádej vysvětlení či potvrzení, než začneš jednat."
    },
    {
      "id": "r7",
      "prompt": "Potřebuješ informovat ATC o možném vysazení motoru.",
      "correct": "We have an engine problem and request priority landing.",
      "options": [
        "We have an engine problem and request priority landing.",
        "We have no traffic.",
        "Continue climb."
      ],
      "why": "V neobvyklé situaci popiš problém srozumitelným anglickým jazykem a sděl potřebu; při skutečné tísni použij odpovídající tísňový postup."
    },
    {
      "id": "r8",
      "prompt": "ATC se ptá, zda je možné zatočit vlevo, ale kvůli počasí ne.",
      "correct": "Unable left turn due to weather.",
      "options": [
        "Wilco.",
        "Unable left turn due to weather.",
        "Affirm turning left."
      ],
      "why": "Nevyhovující pokyn nepřijímej; vysvětli, co nejde, a proč."
    },
    {
      "id": "r9",
      "prompt": "Co vyjadřuje „Roger“?",
      "correct": "Zprávu jsem přijal.",
      "options": [
        "Povolení ke vzletu.",
        "Zprávu jsem přijal.",
        "Pokyn splním."
      ],
      "why": "Roger potvrzuje příjem, ne automaticky souhlas nebo provedení pokynu."
    },
    {
      "id": "r10",
      "prompt": "Ztratil jsi orientaci a potřebuješ pomoc při určení polohy.",
      "correct": "Request position assistance.",
      "options": [
        "Request position assistance.",
        "Cleared to land.",
        "Hold position."
      ],
      "why": "Jednoduše a jasně požádej o pomoc; vysvětli svou aktuální situaci a dostupné údaje."
    },
    {
      "id": "r11",
      "prompt": "Jsi na přiblížení a rozhodneš se nepřistát.",
      "correct": "Going around.",
      "options": [
        "Landing now.",
        "Going around.",
        "Line up and wait."
      ],
      "why": "Going around oznamuje přerušení přistání. Vždy pokračuj bezpečným postupem a řiď se použitelnými pokyny."
    },
    {
      "id": "r12",
      "prompt": "Řídící ti přidělil nový kód odpovídače 4521.",
      "correct": "Squawk 4521.",
      "options": [
        "Runway 4521.",
        "Squawk 4521.",
        "Heading 4521."
      ],
      "why": "Kód transpondéru se v komunikaci označuje slovem squawk. Použij přesný přidělený kód."
    }
  ],
  "circuit": [
    {
      "id": "c1",
      "prompt": "Letíš po větru pro dráhu 27. Jak stručně ohlásíš polohu?",
      "correct": "Downwind runway 27.",
      "options": [
        "Downwind runway 27.",
        "Final runway 27.",
        "Crosswind runway 27."
      ],
      "why": "DOWNWIND = poloha po větru; letíš přibližně rovnoběžně s dráhou v protisměru přistání. Uveď volací značku a případně další údaje požadované místními postupy."
    },
    {
      "id": "c2",
      "prompt": "Jsi na úseku okruhu po vzletu, před první zatáčkou. Jak se nazývá?",
      "correct": "Upwind leg.",
      "options": [
        "Downwind leg.",
        "Upwind leg.",
        "Base leg."
      ],
      "why": "UPWIND = úsek ve směru vzletu. Někdy se odlišuje initial climb podle místních postupů."
    },
    {
      "id": "c3",
      "prompt": "Po první zatáčce letíš napříč směrem dráhy. Jak se úsek nazývá?",
      "correct": "Crosswind leg.",
      "options": [
        "Crosswind leg.",
        "Final approach.",
        "Downwind leg."
      ],
      "why": "CROSSWIND = příčný úsek okruhu mezi odletem a polohou po větru."
    },
    {
      "id": "c4",
      "prompt": "Dokončil jsi zatáčku z polohy po větru na základní úsek před finále. Jak hlásíš polohu?",
      "correct": "Base runway 27.",
      "options": [
        "Final runway 27.",
        "Base runway 27.",
        "Long final runway 27."
      ],
      "why": "BASE = základní úsek okruhu před poslední zatáčkou na finále. V českém AIP se uvádí poloha před poslední zatáčkou."
    },
    {
      "id": "c5",
      "prompt": "Jsi po poslední (čtvrté) okruhové zatáčce, v ose dráhy 27. Jak se hlásíš?",
      "correct": "Final runway 27.",
      "options": [
        "Crosswind runway 27.",
        "Downwind runway 27.",
        "Final runway 27."
      ],
      "why": "Po poslední zatáčce jsi na FINAL (finále). Standardní anglické hlášení polohy je FINAL, nikoli „fourth turn“."
    },
    {
      "id": "c6",
      "prompt": "Blížíš se ke čtvrté zatáčce z base na finále. Co popisuje tvoji činnost?",
      "correct": "Turning final.",
      "options": [
        "Turning final.",
        "Turning downwind.",
        "Vacating runway."
      ],
      "why": "TURNING FINAL znamená zatáčím na finále. Standardní polohové hlášení po dokončení zatáčky je FINAL."
    },
    {
      "id": "c7",
      "prompt": "Chceš se zařadit na finále dráhy 09. Jak popíšeš svůj záměr?",
      "correct": "Request to join final runway 09.",
      "options": [
        "Request to join final runway 09.",
        "Request to cross runway 09.",
        "Request to taxi runway 09."
      ],
      "why": "REQUEST TO JOIN FINAL je srozumitelná žádost o zařazení na konečné přiblížení; konkrétní pokyny a požadavky závisí na letišti a stanovišti."
    },
    {
      "id": "c8",
      "prompt": "Chceš se zařadit do okruhu v poloze po větru dráhy 27. Jaký záměr oznámíš?",
      "correct": "Request to join downwind runway 27.",
      "options": [
        "Request to join downwind runway 27.",
        "Cleared to land runway 27.",
        "Vacated runway 27."
      ],
      "why": "JOIN DOWNWIND znamená zařadit se do okruhu v poloze po větru. Žádost není sama o sobě povolením."
    },
    {
      "id": "c9",
      "prompt": "Řídící požaduje: „Report base.“ Co máš udělat?",
      "correct": "Ohlásit polohu base.",
      "options": [
        "Ihned přistát.",
        "Ohlásit polohu base.",
        "Opustit okruh."
      ],
      "why": "REPORT BASE = ohlaste základní úsek okruhu před poslední zatáčkou."
    },
    {
      "id": "c10",
      "prompt": "Řídící požaduje: „Report final.“ Co to znamená?",
      "correct": "Ohlásit finále.",
      "options": [
        "Ohlásit finále.",
        "Zastavit na vyčkávacím místě.",
        "Změnit kód odpovídače."
      ],
      "why": "REPORT FINAL = ohlaste konečné přiblížení. Neznamená to automaticky povolení k přistání."
    },
    {
      "id": "c11",
      "prompt": "Letíš přímé přiblížení a jsi ve větší vzdálenosti od prahu dráhy. Jak se označuje dlouhé finále?",
      "correct": "Long final.",
      "options": [
        "Long approach clearance.",
        "Long final.",
        "Long downwind."
      ],
      "why": "LONG FINAL je hlášení polohy na vzdáleném finále podle definovaných vzdáleností; není zaměnitelné s pokynem MAKE LONG APPROACH. SERA uvádí pro přímé přiblížení hlášení long final při 8 NM a final při 4 NM."
    },
    {
      "id": "c12",
      "prompt": "Jsi na přímém přiblížení přibližně 8 NM od prahu. Které polohové hlášení je vhodné?",
      "correct": "Long final runway 27.",
      "options": [
        "Base runway 27.",
        "Long final runway 27.",
        "Crosswind runway 27."
      ],
      "why": "Při přímém přiblížení je LONG FINAL hlášení okolo 8 NM; přibližně ve 4 NM pak následuje FINAL, pokud platné místní postupy nestanoví jinak."
    },
    {
      "id": "c13",
      "prompt": "Letíš na finále asi 4 NM od prahu po ohlášení long final. Co nyní hlásíš?",
      "correct": "Final runway 27.",
      "options": [
        "Long final runway 27.",
        "Final runway 27.",
        "Downwind runway 27."
      ],
      "why": "Po hlášení LONG FINAL se podle standardní frazeologie opakuje poloha FINAL ve vzdálenosti přibližně 4 NM."
    },
    {
      "id": "c14",
      "prompt": "ATC ti oznámí: „Extend downwind.“ Co provedeš?",
      "correct": "Prodloužím úsek po větru.",
      "options": [
        "Prodloužím úsek po větru.",
        "Začnu okamžitě čtvrtou zatáčku.",
        "Přejdu do stoupání."
      ],
      "why": "EXTEND DOWNWIND znamená pokračovat po větru déle než obvykle; další zatáčku zahajuj podle pokynů a provozní situace."
    },
    {
      "id": "c15",
      "prompt": "ATC požaduje: „Make short approach.“ Co znamená pokyn?",
      "correct": "Provést zkrácené přiblížení.",
      "options": [
        "Provést zkrácené přiblížení.",
        "Letět na vzdálené finále.",
        "Prodloužit po větru."
      ],
      "why": "MAKE SHORT APPROACH = provést krátké přiblížení v souladu s bezpečností letu a konkrétními pokyny."
    },
    {
      "id": "c16",
      "prompt": "ATC požaduje: „Make long approach.“ Co znamená pokyn?",
      "correct": "Provést prodloužené přiblížení.",
      "options": [
        "Provést prodloužené přiblížení.",
        "Ohlásit pozici long final.",
        "Uvolnit dráhu."
      ],
      "why": "MAKE LONG APPROACH je instrukce k vedení delšího přiblížení. LONG FINAL je naproti tomu hlášení polohy."
    },
    {
      "id": "c17",
      "prompt": "Jsi na finále, ale před tebou je provoz a přistání není možné. Co oznámíš při přerušení přistání?",
      "correct": "Going around.",
      "options": [
        "Going around.",
        "Joining downwind.",
        "Landing complete."
      ],
      "why": "GOING AROUND = přerušuji přistání a provádím postup nezdařeného přiblížení nebo další okruh. Prioritou je bezpečné řízení letu."
    },
    {
      "id": "c18",
      "prompt": "Jak anglicky označíš pravý letištní okruh?",
      "correct": "Right-hand circuit.",
      "options": [
        "Right-hand circuit.",
        "Left final.",
        "Crosswind approach."
      ],
      "why": "RIGHT-HAND CIRCUIT znamená pravý okruh. Směr okruhu může být místně předepsán a musíš jej respektovat."
    },
    {
      "id": "c19",
      "prompt": "Jak anglicky označíš levý letištní okruh?",
      "correct": "Left-hand circuit.",
      "options": [
        "Right base.",
        "Left-hand circuit.",
        "Long final."
      ],
      "why": "LEFT-HAND CIRCUIT znamená levý okruh. Bez výslovného potvrzení nelze automaticky předpokládat směr okruhu na konkrétním letišti."
    },
    {
      "id": "c20",
      "prompt": "Co znamená fráze „Straight-in approach“?",
      "correct": "Přímé přiblížení bez běžného obletu celého okruhu.",
      "options": [
        "Přímé přiblížení bez běžného obletu celého okruhu.",
        "Start první okruhové zatáčky.",
        "Zkrácené pojíždění."
      ],
      "why": "STRAIGHT-IN APPROACH = přímé přiblížení. Podle českého AIP se při něm nehlásí downwind a base, protože se tyto úseky neletí."
    },
    {
      "id": "c21",
      "prompt": "Chceš požádat o přímé přiblížení pro dráhu 27. Co řekneš?",
      "correct": "Request straight-in approach runway 27.",
      "options": [
        "Request straight-in approach runway 27.",
        "Report crosswind runway 27.",
        "Hold short runway 27."
      ],
      "why": "REQUEST STRAIGHT-IN APPROACH je žádost o přímé přiblížení, nikoli povolení. U nekontrolovaného letiště přizpůsob komunikaci místním postupům."
    },
    {
      "id": "c22",
      "prompt": "Jak hlásíš, že opouštíš dráhu po přistání?",
      "correct": "Runway vacated.",
      "options": [
        "Final.",
        "Runway vacated.",
        "Going around."
      ],
      "why": "RUNWAY VACATED = dráha je uvolněná. Hlášení prováděj podle místních postupů a požadavků ATC/AFIS."
    }
  ]
};
