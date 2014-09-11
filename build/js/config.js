var config = {
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
  ]
}