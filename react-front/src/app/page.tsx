'use client'

import React, { useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Home() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('pt-br');
  const [diagnostic, setDiagnostic] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setDiagnostic('');
    setRecommendations('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/diagnostic`, {
        text,
        lang,
      });

      setDiagnostic(response.data.detailed_diagnostic);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      setDiagnostic('Erro ao gerar diagnóstico.');
      setRecommendations('Erro ao gerar recomendações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Assistente de Diagnóstico Elétrico - IA
            </h1>
          </div>
        </div>

        {/* Input Problem Description */}
        <div className="mb-6">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Descreva o problema elétrico..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Escolha o idioma:
          </label>
          <div className="relative">
            <select
              className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="pt-br">Português</option>
              <option value="en">Inglês</option>
              <option value="es">Espanhol</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* Diagnose Button */}
        <div className="flex justify-center mb-8">
          <button
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={handleSubmit}
          >
            Diagnosticar
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Diagnóstico:</h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              {loading ? <Skeleton count={3} /> : <p className="text-gray-700">{diagnostic}</p>}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Soluções Recomendadas:</h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              {loading ? <Skeleton count={3} /> : <p className="text-gray-700">{recommendations}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Desenvolvido por <span className="font-bold text-purple-600">Marcos Tullio</span>
        </p>
      </div>
    </div>
  );
}