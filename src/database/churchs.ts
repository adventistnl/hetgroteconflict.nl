export interface iChurchs {
  id: string;
  name?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  days?: string[];
  website?: string;
}

export const churchsDatabase: iChurchs[] = [
  {
      "id": "42",
      "name": "Alivio Delft",
      "address": "Hermesstraat 65 Delft, Zuid-Holland, 2624 BG",
      "phoneNumber": "0031-616485686",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-aliviodelft/"
  },
  {
      "id": "29",
      "name": "Alkmaar",
      "address": "Honkpad 2 Alkmaar, 1816 LZ",
      "phoneNumber": "06 51560807",
      "days": [
          "Fri"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-alkmaar/"
  },
  {
      "id": "30",
      "name": "Almelo (De Boskapel)",
      "address": "Oude Deldenseweg 2 Almelo, Overijssel, 7601 RJ",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-almelo/"
  },
  {
      "id": "89",
      "name": "Alphen DC",
      "address": "Oude Wereld 57 Alphen aan den Rijn, Zuid-Holland, 2408 NV",
      "phoneNumber": "030-6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.alphen-dc.nl/"
  },
  {
      "id": "33",
      "name": "Amersfoort",
      "address": "Asschatterweg 1 Leusden, 3831 JJ",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventistenamersfoort.nl/"
  },
  {
      "id": "35",
      "name": "Amsterdam Ghana",
      "address": "Kortvoort 73 Amsterdam, Noord-Holland, 1104 NA",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-amsterdamghana/"
  },
  {
      "id": "91",
      "name": "Amsterdam Noord",
      "address": "het Breed 2 Amsterdam, Noord-Holland, 1025 HR",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.zda-amsterdam-noord.nl/"
  },
  {
      "id": "82",
      "name": "Amsterdam Portugees",
      "address": "Burgemeester Haspelslaan 133 Amstelveen, Noord-Holland, 1181 NC",
      "phoneNumber": "0622937046",
      "email": "grupo.amsterdam@hotmail.com",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/amsterdam-portugees/"
  },
  {
      "id": "36",
      "name": "Amsterdam Zuid",
      "address": "Johan Braakensiekhof 1 Amsterdam, Noord-Holland, 1068 KK",
      "phoneNumber": "06 51560807",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-amsterdamzuid/"
  },
  {
      "id": "37",
      "name": "Amsterdam Zuidoost",
      "address": "Renswoudestraat 75 Amsterdam, Noord-Holland, 1106 BJ",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-amsterdamzuidoost/"
  },
  {
      "id": "38",
      "name": "Apeldoorn",
      "address": "Mercuriuslaan 37 Apeldoorn, Gelderland, 7314 KR",
      "phoneNumber": "06 20740314",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventkerkapeldoorn.nl/"
  },
  {
      "id": "78",
      "name": "ARK Zoetermeer",
      "address": "Pieter van der Plasstraat 22 Wateringen, Zuid-Holland, 2291 SE",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/churchplant-ark/"
  },
  {
      "id": "39",
      "name": "Arnhem",
      "address": "Parkstraat 46 Arnhem, Gelderland, 6828 JK",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventkerkarnhem.nl/"
  },
  {
      "id": "40",
      "name": "Assen",
      "address": "Assen, Drenthe",
      "phoneNumber": "0592-415454 of 06 45396475",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-assen/"
  },
  {
      "id": "34",
      "name": "Bon Notisia Amsterdam",
      "address": "Luthuliplein 11 Amsterdam, Noord-Holland, 1103 TR",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/churchplant-bonnotisia/"
  },
  {
      "id": "41",
      "name": "Breda",
      "address": "Harmonielaan 24 Prinsenbeek, Noord-Brabant, 4841 VL",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-breda/"
  },
  {
      "id": "86",
      "name": "Churchplant Refugio",
      "address": "Jan Luykenlaan 92 (Marcuskerk) Den Haag, Zuid-Holland 2533 JT",
      "phoneNumber": "030 – 693 93 75 (Landelijk Kantoor)",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ]
  },
  {
      "id": "84",
      "name": "De Fontein (De Kleine Kerk)",
      "address": "Rijksstraatweg 129 Duivendrecht, Noord-Holland 1115 AP",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ]
  },
  {
      "id": "43",
      "name": "Den Haag",
      "address": "Robijnhorst 197 Den Haag, Zuid-Holland, 2592 TS",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-denhaag/"
  },
  {
      "id": "96",
      "name": "Deventer",
      "address": "Binnensingel 42 Deventer, Overijssel, 7411 PN",
      "phoneNumber": "06-12298369",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgmeente-deventer/"
  },
  {
      "id": "44",
      "name": "Doetinchem",
      "address": "Bilderdijkstraat 4 Doetinchem, Gelderland, 7002 AB",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-doetinchem/"
  },
  {
      "id": "45",
      "name": "Dordrecht",
      "address": "Zuidendijk 15-17 Dordrecht, Zuid-Holland, 3314 CP",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-dordrecht/"
  },
  {
      "id": "46",
      "name": "Eindhoven",
      "address": "Geestakker 546 Eindhoven, Noord-Brabant, 5625 XL",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://adventist-eindhoven.nl/"
  },
  {
      "id": "47",
      "name": "Emmen",
      "address": "Boermarkeweg 58c Emmen, Drenthe, 7824 AA",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist-emmen.nl/"
  },
  {
      "id": "48",
      "name": "Enschede",
      "address": "Haaksbergerstraat 468 Enschede, Overijsel, 7545 GB",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ],
      "website": "https://www.zda-enschede.nl/"
  },
  {
      "id": "49",
      "name": "Gorinchem",
      "address": "Nicolaas Pieckstraat 45 Gorinchem, Zuid-Holland, 4205 BR",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://adventkerkgorinchem.nl/"
  },
  {
      "id": "50",
      "name": "Gouda",
      "address": "Johan de Wittlaan 31 Gouda, Zuid-Holland, 2805 CM",
      "phoneNumber": "06 27 21 34 23",
      "email": "andyselassa7@hotmail.com",
      "days": [
          "Sat"
      ],
      "website": "http://www.zdagouda.nl/"
  },
  {
      "id": "51",
      "name": "Groningen",
      "address": "Hofstraat 28 Groningen, Groningen, 9712 JC",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventkerkgroningen.nl/"
  },
  {
      "id": "52",
      "name": "Haarlem",
      "address": "Oranjekade 1 Haarlem, Noord-Holland, 2011 VC",
      "phoneNumber": "06 51560807",
      "days": [
          "Sat"
      ],
      "website": "http://www.adventist-haarlem.nl/"
  },
  {
      "id": "53",
      "name": "Harderwijk",
      "address": "Verkeersweg 2 Harderwijk, Gelderland, 3841 DD",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "http://www.adventkerkharderwijk.nl/"
  },
  {
      "id": "54",
      "name": "Heerlen",
      "address": "Schandelerstraat 81 Heerlen, Limburg, 6412 XM",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "http://heerlen.www.adventist.nl/"
  },
  {
      "id": "67",
      "name": "Het Kompas Rotterdam",
      "address": "Hillevliet 139 Rotterdam, Zuid-Holland, 3073 KP",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-hetkompas/"
  },
  {
      "id": "55",
      "name": "Hilversum",
      "address": "Boomberglaan 6 Hilversum, Noord-Holland, 1217 RR",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist-hilversum.nl/"
  },
  {
      "id": "97",
      "name": "Hoogeveen",
      "address": "Zwarte Dijkje 45 Noordscheschut, 7914 PB",
      "phoneNumber": "030 – 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-hoogeveen/"
  },
  {
      "id": "57",
      "name": "Huis Ter Heide",
      "address": "Amersfoortseweg 18 Huis Ter Heide, Utrecht, 3712 BC",
      "phoneNumber": "06 83 03 09 26",
      "email": "secretaris@adventkapelhth.com",
      "days": [
          "Sat"
      ],
      "website": "http://www.adventkapelhth.com/"
  },
  {
      "id": "58",
      "name": "Huizen",
      "address": "Bakboord 72 Huizen, Utrecht, 1276BL",
      "phoneNumber": "06 20740314",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-huizen/"
  },
  {
      "id": "90",
      "name": "Jesus es la Esperanza",
      "address": "Groenhoven 650 Amsterdam, Noord-Holland 1103 LT",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ]
  },
  {
      "id": "59",
      "name": "Leeuwarden",
      "address": "Dokkumertrekweg 41 (v/h Eeskwerd 1) Leeuwarden, Friesland, 8918AA",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "http://www.adventkerkleeuwarden.nl/"
  },
  {
      "id": "60",
      "name": "Leiden",
      "address": "Mauritslaan 12 Oegstgeest, Zuid-Holland, 2341EM",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "http://adventkerkleiden.nl/"
  },
  {
      "id": "61",
      "name": "Lelystad",
      "address": "Pauwenburg 170 Lelystad, 8226 TA",
      "phoneNumber": "06-34172011",
      "days": [
          "Sat"
      ],
      "website": "http://www.adventkerklelystad.nl/"
  },
  {
      "id": "81",
      "name": "Lelystad",
      "address": "Voorstraat 313 Lelystad, Flevoland, 8226KB",
      "phoneNumber": "0320-256111",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/churchplant-speranza/"
  },
  {
      "id": "62",
      "name": "Meppel",
      "address": "Nova Zemblastraat 4 Meppel, Drenthe, 7942 HV",
      "phoneNumber": "06 20740314",
      "days": [
          "Sat"
      ],
      "website": "https://adventkerkmeppel.nl/"
  },
  {
      "id": "63",
      "name": "Nijmegen (DoRe kerk)",
      "address": "Prof. Regoutstr. 23 Nijmegen, Gelderland, 6524 RZ",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventkerk-nijmegen.nl/"
  },
  {
      "id": "94",
      "name": "Rotterdam International",
      "address": "Guido Gezelleweg 1 Rotterdam, Zuid-Holland, 3076 EB",
      "phoneNumber": "030 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-rotterdaminternational/"
  },
  {
      "id": "65",
      "name": "Rotterdam Noord",
      "address": "Minstreelstraat 9 Rotterdam, Zuid-Holland, 3051 PH",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "http://www.adventist-rotterdamnoord.nl/"
  },
  {
      "id": "93",
      "name": "Rotterdam Noord",
      "address": "Minstreelstraat 9 Rotterdam, 3051 PH",
      "phoneNumber": "030 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-rotterdamnoord/"
  },
  {
      "id": "66",
      "name": "Rotterdam Zuid",
      "address": "Amelandseplein 68 Rotterdam, 3083 SJ, 3083 SJ",
      "days": [
          "Sat"
      ],
      "website": "http://www.zdarotterdamzuid.nl/"
  },
  {
      "id": "32",
      "name": "Samen (buurtcentrum 't Kardoes)",
      "address": "J.G. Suurhoffstraat 45 Almere-Stad, Flevoland 1314 NR",
      "phoneNumber": "030 - 6939375 (Landelijk Kantoor)",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ]
  },
  {
      "id": "69",
      "name": "Schiedam (De Dorpskerk in Kethel)",
      "address": "Noordeinde 10 Schiedam, Zuid-Holland 3121 KG",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ]
  },
  {
      "id": "92",
      "name": "Schiedam E Oasis",
      "address": "Lange Nieuwstraat 219 Schiedam, Zuid-Holland, 3111 AJ",
      "phoneNumber": "030 – 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.eoasis.nl/"
  },
  {
      "id": "70",
      "name": "Spijkenisse/Hoogvliet",
      "address": "Middenbaan-Zuid 75 Hoogvliet-Rotterdam, Zuid-Holland, 3191 AH",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-spijkenisse/"
  },
  {
      "id": "87",
      "name": "Tempu pa Dios",
      "address": "Wiekslag 3 Capelle aan den IJssel, Zuid-Holland, 2903 VA",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/gemeente-tempupadios/"
  },
  {
      "id": "71",
      "name": "Terneuzen (Bron van Hoop)",
      "address": "Sweelinckhof 9 Terneuzen, Zeeland, 4536 HA",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-terneuzen/"
  },
  {
      "id": "72",
      "name": "Tilburg (Amigu)",
      "address": "Diederikdreef 14 (De Ontmoetingskerk) Tilburg, Noord-Brabant, 5046 GT",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-tilburg/"
  },
  {
      "id": "74",
      "name": "Uniek (De Klepel)",
      "address": "Zandweg 126 De Meern, Utrecht, 3454 JZ",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "http://www.uniek-utrecht.nl/"
  },
  {
      "id": "73",
      "name": "Utrecht (Triumfatorkerk)",
      "address": "Marco Pololaan 185 Utrecht, Utrecht, 3526 GB",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-utrecht/"
  },
  {
      "id": "85",
      "name": "Voorburg International",
      "address": "Bruijnings Ingenhoeslaan 4 Voorburg, Zuid-Holland, 2273 KR",
      "phoneNumber": "+32 487 74 62 50",
      "email": "bolanosanderson@gmail.com",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-voorburginternational/"
  },
  {
      "id": "75",
      "name": "Vredenoord (Woonzorgcentrum Vredenoord)",
      "address": "Pr. Alexanderweg 2-4 Huis Ter Heide, Utrecht 3712 AA",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ]
  },
  {
      "id": "76",
      "name": "Winschoten",
      "address": "Pottebakkerstraat 4 Winschoten, Groningen, 9671 LE",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-winschoten/"
  },
  {
      "id": "68",
      "name": "X-preszo",
      "address": "Cornelis Danckertsstraat 36 Rotterdam, Zuid-Holland, 3067 XG",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-x-preszo/"
  },
  {
      "id": "77",
      "name": "Zeeland",
      "address": "Kerklaan 19 Vlissingen, Zeeland, 4386 AL",
      "phoneNumber": "0118-477222",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-zeeland/"
  },
  {
      "id": "88",
      "name": "Zoetermeer",
      "address": "Nathaliegang 263 Zoetermeer, Zuid-Holland, 2719CR",
      "phoneNumber": "06 45620910",
      "days": [
          "Sat"
      ],
      "website": "https://www.adventist.nl/anbi/gemeenten/adventgemeente-zoetermeer/"
  },
  {
      "id": "56",
      "name": "Zwarte Dijkje 45",
      "address": "Noordscheschut Drenthe 7914 PB",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Mon, Tues, Wed, Thur, Fri, Sat, Sun"
      ]
  },
  {
      "id": "79",
      "name": "Zwolle",
      "address": "Burg. Drijbersingel 15 Zwolle, Overijssel, 8021 DA",
      "phoneNumber": "030 - 6939375",
      "days": [
          "Sat"
      ],
      "website": "http://www.zdagemeentezwolle.nl/"
  }
]