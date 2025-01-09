from pydantic import BaseModel
import os
from langchain_openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Classe para o corpo da requisição
class InputData(BaseModel):
    text: str
    lang: str

# Configuração da classe de LLM
class LLMService:
    LANGUAGES = ['pt-br', 'en', 'es']  # Idiomas suportados

    def __init__(self):
        hf_token = os.getenv("HF_TOKEN")
        if not hf_token:
            raise ValueError(
                "HF_TOKEN não está configurado. Defina a variável de ambiente.")

        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=hf_token,
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    def validate_language(self, lang: str) -> bool:
        """
        Valida se o idioma fornecido é suportado.
        """
        return lang in self.LANGUAGES

    def generate_diagnostic(self, text: str, lang: str) -> str:
        if not self.validate_language(lang):
            return f"Erro: O idioma '{lang}' não é suportado."

        prompt = (
            f"Você é um especialista técnico em diagnósticos elétricos. Analise o problema descrito abaixo de maneira objetiva e profissional, sem incluir palavras-chave ou formatação excessiva. "
            f"Concentre-se apenas em identificar as possíveis causas técnicas do problema de forma clara e concisa, sem repetições ou informações irrelevantes. "
            f"Responda de forma direta, humana e sem tópicos.\n\n"
            f"**Problema:** {text}\n\n"
            f"O diagnóstico deve ser uma explicação fluída e natural, sem iniciar ou terminar com palavras-chave. Responda no idioma '{lang}'."
        )


        try:
            response = self.llm.invoke(prompt)
            return response.strip()
        except Exception as e:
            # Log detalhado do erro
            print(f"Erro ao gerar diagnóstico: {e}")
            return f"Erro ao gerar diagnóstico: {e}"

    def generate_recommendations(self, text: str, lang: str) -> str:
        if not self.validate_language(lang):
            return f"Erro: O idioma '{lang}' não é suportado."
        
        prompt = (
            f"Com base no diagnóstico técnico abaixo, forneça recomendações práticas e diretas, com um limite máximo de 850 caracteres. "
            f"Seja objetivo e evite repetições. Concentre-se nas ações que podem ser tomadas para resolver o problema, sem informações desnecessárias. "
            f"Não use introduções, tópicos ou formatação excessiva. Forneça as soluções de forma fluída, como se estivesse explicando rapidamente a alguém que precisa de ajuda imediata. "
            f"Responda no idioma '{lang}'.\n\n"
            f"**Diagnóstico:** {text}\n\n"
            f"As soluções devem ser diretas, práticas e sem repetições, respeitando o limite de 850 caracteres."
        )

        try:
            response = self.llm.invoke(prompt)
            return response.strip()
        except Exception as e:
            # Log detalhado do erro
            print(f"Erro ao gerar recomendações: {e}")
            return f"Erro ao gerar recomendações: {e}"
