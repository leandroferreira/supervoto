define([], function () {
  return {
    "filtros": [
      {"id":"cargos", "name":"Cargo"},
      {"id":"estados", "name":"Estado"},
      {"id":"partidos", "name":"Partido"}
    ],
    "ordens": [
      {"id":"atributos", "name":"Atributo"}
    ],
    "cargos": ["deputado", "senador"],
    "estados": ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"],
    "partidos": ["PMDB", "PT", "PSDB", "PTB", "PP", "PDT", "PR", "PSB", "DEM", "PCdoB", "PSD", "PSC", "PV", "PSOL", "PRB", "PRP", "SD", "PROS", "PPS", "PMN", "PEN", "PtdoB"],
    "atributos": [
      {
        "id": "forca",
        "name": "força",
      },
      {
        "id": "atuacao",
        "name": "atuação",
        "min": 0,
        "max": 100
      },
      {
        "id": "processos",
        "name": "processos",
        "min": -100,
        "max": 0
      },
      {
        "id": "privilegios",
        "name": "privilégios",
        "min": -100,
        "max": 100
      },
      {
        "id": "assiduidade",
        "name": "assiduidade",
        "min": -100,
        "max": 100
      }
    ],
    "badges": [
      {
        "id": 1,
        "name": "Administração Pública",
        "desc": "Propõe projetos para alterar práticas da máquina pública"
      },
      {
        "id": 2,
        "name": "Agricultura",
        "desc": "Legisla sobre questões voltadas à agricultura e à reforma agrária"
      },
      {
        "id": 3,
        "name": "Bancada Evangélica",
        "desc": "Se une a outros políticos de mesma fé na defesa de suas causas."
      },
      {
        "id": 4,
        "name": "Bancada Ruralista",
        "desc": "Luta pelos interesses dos grandes produtores agropecuaristas, mineradoras etc."
      },
      {
        "id": 5,
        "name": "Ciência e Tecnologia",
        "desc": "Cria projetos relacionados ao desenvolvimento tecnológico e científico."
      },
      {
        "id": 6,
        "name": "Conservador",
        "desc": "Defende valores tradicionais e/ou se opõe a certas mudanças político-sociais."
      },
      {
        "id": 7,
        "name": "Consumidor",
        "desc": "Iniciativas que garantem mais direitos ao consumidor."
      },
      {
        "id": 8,
        "name": "Cultura",
        "desc": "Defende interesses relacionados a Cultura"
      },
      {
        "id": 9,
        "name": "Direitos da Mulher",
        "desc": "Luta pela igualdade de gênero"
      },
      {
        "id": 10,
        "name": "Direitos dos Deficientes",
        "desc": "Defende deficientes físicos e/ou mentais."
      },
      {
        "id": 11,
        "name": "Direitos dos Idosos",
        "desc": "Luta por melhorias e direitos para as pessoas da terceira idade."
      },
      {
        "id": 12,
        "name": "Direitos LGBT",
        "desc": "Defesa do direito de diferentes sexualidades"
      },
      {
        "id": 13,
        "name": "Educação",
        "desc": "Defende políticas públicas relacionadas à educação."
      },
      {
        "id": 14,
        "name": "Energia",
        "desc": "Propõe melhorias na área de energia no país."
      },
      {
        "id": 15,
        "name": "Esportes",
        "desc": "Propõe projetos para a valorização do esporte."
      },
      {
        "id": 16,
        "name": "Executivo",
        "desc": "Está se candidatando ao poder executivo."
      },
      {
        "id": 17,
        "name": "Igualdade Social",
        "desc": "Projetos que visam combater a desigualdade econômica e social"
      },
      {
        "id": 18,
        "name": "Impostos",
        "desc": "Propõe leis que visam a reformulação de impostos e/ou incentivos fiscais."
      },
      {
        "id": 19,
        "name": "Internet",
        "desc": "Legisla sobre questões voltadas a internet"
      },
      {
        "id": 20,
        "name": "Líder",
        "desc": "É ou já foi presidente da Câmara/Senado ou lider de seu partido/coligação/bancada."
      },
      {
        "id": 21,
        "name": "Reforma Eleitoral",
        "desc": "Medidas para otimizar o processo eleitoral visando torná-lo mais democrático e eficiente."
      },
      {
        "id": 22,
        "name": "Saúde",
        "desc": "Defende políticas públicas relacionadas à saúde."
      },
      {
        "id": 23,
        "name": "Segurança Pública",
        "desc": "Defende políticas públicas relacionadas à Segurança Pública"
      },
      {
        "id": 24,
        "name": "Suspeito",
        "desc": "Aparições em diversas investigações de corrupção e/ou irregularidades"
      },
      {
        "id": 25,
        "name": "Sustentabilidade",
        "desc": "Luta pelo meio ambiente e por políticas sustentáveis"
      },
      {
        "id": 26,
        "name": "Trabalho",
        "desc": "Legisla sobre os direitos e deveres dos trabalhadores e das empresas"
      },
      {
        "id": 27,
        "name": "Transparência",
        "desc": "Iniciativas que obrigam serviços e servidores públicos a serem mais transparentes."
      },
      {
        "id": 28,
        "name": "Transporte",
        "desc": "Legisla sobre as estradas e meios de transporte"
      },
      {
        "id": 29,
        "name": "Economia",
        "desc": "Propõe melhorias econômicas no país."
      }
    ]};
});