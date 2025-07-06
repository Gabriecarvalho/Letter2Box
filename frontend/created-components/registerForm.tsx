"use client";
import axios from "axios";
import { User } from "@shared/User";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import GradientText from "./GradientText";
import EmergeIn from "./EmergeIn";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos.", { duration: 1500 });
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/users", formData, { withCredentials: true });
      toast.success("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, { duration: 1500 });
      } else {
        toast.error("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmergeIn>
      <div className="relative flex min-h-screen items-center justify-center px-6 bg-gradient-to-b from-black via-[#0e0e0e] to-[#1c1c1c] text-white">
        {/* Botão voltar */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 text-white text-2xl hover:text-gray-300 transition-colors"
        >
          &#60;
        </button>

        {/* Card de formulário */}
        <div className="w-full max-w-md rounded-2xl bg-[#121212] p-8 shadow-xl border border-gray-800">
          <h1 className="text-3xl font-bold text-center mb-2">
            <GradientText>Crie sua conta</GradientText>
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <Label htmlFor="name" className="text-white">
                Nome
              </Label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-700 bg-[#1e1e1e] text-white p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                E-mail
              </Label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-700 bg-[#1e1e1e] text-white p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-700 bg-[#1e1e1e] text-white p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-1 right-3 flex items-center text-gray-500 h-24 pr-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-center">
              <a
                href="/login"
                className="text-sm text-green-500 hover:underline"
              >
                Já tem uma conta? Entre aqui
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-full hover:bg-green-500 hover:scale-105 transition-transform"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </div>
      </div>
    </EmergeIn>
  );
};

export default RegisterForm;
