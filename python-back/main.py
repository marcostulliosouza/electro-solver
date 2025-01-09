from fastapi import FastAPI, HTTPException
from llm_service import LLMService, InputData
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

port = os.getenv("PORT", 8000)

# Inicializa o aplicativo FastAPI
app = FastAPI()

# Configurar o middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Instância do serviço de LLM
llm_service = LLMService()


@app.post("/diagnostic")
async def diagnostic(data: InputData):
    """
    Endpoint para realizar diagnóstico e recomendações com base no texto enviado e no idioma.
    """
    # Verifica se o idioma é suportado
    if not llm_service.validate_language(data.lang):
        raise HTTPException(
            status_code=400,
            detail=f"Idioma '{data.lang}' não é suportado. Idiomas disponíveis: {', '.join(llm_service.LANGUAGES)}"
        )

    # Gera diagnóstico detalhado usando IA
    detailed_diagnostic = llm_service.generate_diagnostic(data.text, data.lang)

    # Gera recomendações com base no diagnóstico detalhado
    recommendations = llm_service.generate_recommendations(detailed_diagnostic, data.lang)

    # Retorna os resultados
    return {
        "detailed_diagnostic": detailed_diagnostic,
        "recommendations": recommendations,
    }


@app.get("/")
async def root():
    """
    Endpoint raiz para verificar o funcionamento do sistema.
    """
    return {"message": "API de diagnóstico está funcionando!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=int(port))
