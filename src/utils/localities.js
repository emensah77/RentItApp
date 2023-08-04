const localities = {
  'Greater Accra': [
    'ASHAIMAN',
    'LEDZOKUKU',
    'KPONE KATAMANSO',
    'ABLEKUMA WEST MUNICIPAL',
    'LA DADEKOTOPON MUNICIPAL',
    'SHAI OSUDOKU',
    'OKAIKOI NORTH',
    'GA SOUTH',
    'GA CENTRAL MUNICIPAL',
    'LA NKWANTANANG -MADINA MUNICIPAL',
    'TEMA WEST',
    'AYAWASO EAST',
    'ABLEKUMA NORTH MUNICIPAL',
    'GA EAST',
    'ABLEKUMA CENTRAL MUNICIPAL',
    'WEIJA GBAWE MUNICIPAL',
    'GA NORTH',
    'GA WEST',
    'ADENTAN MUNICIPAL',
    'KROWOR MUNICIPAL',
    'AMA-ASHIEDU KETEKE',
    'TMA-TEMA EAST',
    'NINGO PRAMPRAM',
    'AMA-OKAIKOI SOUTH',
    'AYAWASO CENTRAL MUNICIPAL',
    'AMA-ABLEKUMA SOUTH',
    'KORLE KLOTTEY',
    'TMA-TEMA CENTRAL',
    'ADA EAST',
    'ADA WEST',
    'AYAWASO NORTH MUNICIPAL',
    'AYAWASO WEST MUNICIPAL',
  ],
  'Western North': [
    'AOWIN MUNICIPAL',
    'BIBIANI ANHWIASO BEKWAI',
    'SEFWI WIAWSO',
    'BODI',
    'JUABOSO',
    'SUAMAN',
    'SEFWI AKONTOMBRA',
    'BIA WEST',
    'BIA EAST',
  ],
  Ashanti: [
    'ADANSI NORTH',
    'SEKYERE SOUTH',
    'ATWIMA NWABIAGYA SOUTH MUNICIPAL',
    'AMANSIE WEST',
    'OBUASI MUNICIPAL',
    'KWADASO MUNICIPAL',
    'OLD TAFO MUNICIPAL',
    'AHAFO ANO SOUTH WEST',
    'ASANTE AKIM NORTH',
    'OFORIKROM',
    'ATWIMA NWABIAGYA NORTH',
    'KWABRE EAST',
    'SEKYERE CENTRAL',
    'OFFINSO NORTH',
    'AMANSIE CENTRAL',
    'AFIGYA KWABRE SOUTH',
    'AFIGYA KWABRE NORTH',
    'OBUASI EAST',
    'BEKWAI MUNICIPAL',
    'ADANSI SOUTH',
    'ATWIMA MPONUA',
    'EJISU',
    'KMA-MANHYIA NORTH',
    'ATWIMA KWANWOMA',
    'KMA-SUBIN',
    'SEKYERE KUMAWU',
    'ASANTE AKIM CENTRAL MUNICIPAL',
    'BOSOMTWI',
    'AHAFO ANO SOUTH EAST',
    'MAMPONG MUNICIPAL',
    'EJURA SEKYEDUMASE',
    'SUAME MUNICIPAL',
    'KMA-MANHYIA SOUTH',
    'OFFINSO MUNICIPAL',
    'ASOKWA',
    'AHAFO ANO NORTH',
    'ASOKORE MAMPONG',
    'KMA-BANTAMA',
    'ASANTE_AKIM_SOUTH',
    'JUABEN MUNICIPAL',
    'SEKYERE EAST',
    'AMANSIE SOUTH',
    'BOSOME FREHO',
    'AKROFUOM',
    'ADANSI ASOKWA',
    'KMA-NHYIAESO',
    'SEKYERE AFRAM PLAINS',
  ],
  Oti: [
    'BIAKOYE',
    'KADJEBI',
    'KRACHI EAST',
    'KRACHI NCHUMURU',
    'JASIKAN',
    'NKWANTA NORTH',
    'GUAN',
    'KRACHI WEST',
    'NKWANTA SOUTH',
  ],
  Bono: [
    'DORMAA EAST',
    'JAMAN NORTH',
    'WENCHI MUNICIPAL',
    'BEREKUM EAST MUNICIPAL',
    'BEREKUM WEST',
    'DORMAA WEST',
    'SUNYANI MUNICIPAL',
    'SUNYANI WEST',
    'TAIN',
    'DORMAA MUNICIPAL',
    'BANDA',
    'JAMAN SOUTH',
  ],
  Eastern: [
    'ATIWA WEST',
    'FANTEAKWA SOUTH',
    'ASUOGYAMAN',
    'LOWER MANYA KROBO',
    'NSAWAM ADOAGYIRI MUNICIPAL',
    'ABUAKWA SOUTH',
    'KWAHU AFRAM PLAINS NORTH',
    'SUHUM MUNICIPAL',
    'AKYEMANSA',
    'NEW JUABEN SOUTH',
    'ABUAKWA NORTH',
    'AKWAPIM SOUTH',
    'NEW JUABEN NORTH',
    'BIRIM NORTH',
    'DENKYEMBOUR',
    'ASENE MANSO AKROSO',
    'AYENSUANO',
    'BIRIM CENTRAL',
    'KWAHU SOUTH',
    'KWAHU WEST',
    'WEST AKIM',
    'BIRIM SOUTH',
    'YILO KROBO',
    'FANTEAKWA NORTH',
    'KWAHU EAST',
    'ACHIASE',
    'KWAEBIBIREM',
    'UPPER MANYA KROBO',
    'UPPER WEST AKIM',
    'KWAHU AFRAM PLAINS SOUTH',
    'AKWAPIM NORTH',
    'ATIWA EAST',
    'OKERE DISTRICT',
  ],
  Volta: [
    'HOHOE MUNICIPAL',
    'CENTRAL TONGU',
    'KETA MUNICIPAL',
    'HO',
    'KETU SOUTH',
    'AFADZATO SOUTH',
    'AKATSI SOUTH',
    'SOUTH DAYI',
    'HO-WEST',
    'ADAKLU',
    'SOUTH TONGU',
    'AKATSI NORTH',
    'KPANDO MUNICIPAL',
    'KETU NORTH',
    'AGORTIME ZIOPE',
    'ANLOGA',
    'NORTH TONGU',
    'NORTH DAYI',
  ],
  Central: [
    'ASSIN FOSU  MUNICIPAL',
    'GOMOA EAST',
    'EFFUTU',
    'MFANTSIMAN',
    'ASIKUMAN / ODOBEN / BRAKWA',
    'AGONA WEST',
    'AWUTU SENYA',
    'ABURA ASEBU KWAMANKESE',
    'GOMOA WEST',
    'UPPER DENKYIRA EAST',
    'AWUTU SENYA EAST',
    'KOMENDA EDINA EGUAFO ABIREM',
    'TWIFO HEMAN LOWER DENKYIRA',
    'UPPER DENKYIRA WEST',
    'ASSIN NORTH',
    'AGONA EAST',
    'GOMOA CENTRAL',
    'TWIFO ATI MORKWA',
    'ASSIN SOUTH',
    'AJUMAKO-ENYAN-ESIAM',
    'EKUMFI',
    'CAPE COAST SOUTH',
    'CAPE COAST NORTH',
  ],
  'Upper West': [
    'NADOWLI-KALEO',
    'WA MUNICIPAL',
    'SISSALA EAST',
    'SISSALA WEST',
    'NANDOM',
    'LAWRA',
    'LAMBUSSIE-KARNI',
    'JIRAPA',
    'WA EAST',
    'WA WEST',
    'DAFFIAMA BUSSIE',
  ],
  Western: [
    'TARKWA NSUAEM',
    'WASSA AMENFI CENTRAL',
    'WASSA EAST',
    'AHANTA WEST',
    'SHAMA',
    'STMA-ESSIKADO KETAN',
    'WASSA AMENFI EAST',
    'PRESTEA HUNI VALLEY',
    'MPOHOR',
    'WASSA AMENFI WEST MUNICIPAL',
    'JOMORO',
    'ELLEMBELLE',
    'NZEMA EAST',
    'EFFIA-KWESIMINTSIM',
    'SEKONDI',
    'TAKORADI',
  ],
  'Bono East': [
    'TECHIMAN MUNICIPAL',
    'PRU EAST',
    'NKORANZA SOUTH',
    'NKORANZA NORTH',
    'ATEBUBU AMANTIN',
    'SENE WEST',
    'KINTAMPO NORTH',
    'TECHIMAN NORTH',
    'SENE EAST',
    'PRU WEST',
    'KINTAMPO SOUTH',
  ],
  Savannah: [
    'BOLE',
    'EAST GONJA',
    'NORTH EAST GONJA',
    'CENTRAL GONJA',
    'SAWLA-TUNA-KALBA',
    'WEST GONJA',
    'NORTH GONJA',
  ],
  'Upper East': [
    'BUILSA SOUTH',
    'BUILSA NORTH',
    'KASENA NANKANA MUNICIPAL',
    'BOLGATANGA MUNICIPAL',
    'TALENSI',
    'KASSENA NANKANA WEST',
    'NABDAM',
    'BAWKU WEST',
    'BINDURI',
    'BOLGATANGA EAST',
    'BONGO',
    'BAWKU MUNICIPAL',
    'GARU',
    'TEMPANE',
  ],
  Ahafo: [
    'ASUNAFO SOUTH',
    'ASUNAFO NORTH',
    'TANO SOUTH',
    'ASUTIFI SOUTH',
    'TANO NORTH',
    'ASUTIFI  NORTH',
  ],
  'North East': [
    'WEST MAMPRUSI',
    'MAMPRUGU MOAGDURI',
    'YUNYOO NASUAN',
    'EAST MAMPRUSI',
    'BUNKPURUGU NAKPANDURI',
  ],
  Northern: [
    'KPANDAI',
    'NANUMBA NORTH',
    'NANUMBA SOUTH',
    'SAGNERIGU',
    'ZABZUGU',
    'KUMBUNGU',
    'SABOBA',
    'MION',
    'TAMALE CENTRAL',
    'GUSHIEGU',
    'YENDI',
    'TAMALE SOUTH',
    'SAVELUGU',
  ],
};

export const getSubLocalities = locality =>
  localities[locality]?.map(name => ({value: name, name})) || [];
export default Object.keys(localities).map(name => ({value: name, name}));