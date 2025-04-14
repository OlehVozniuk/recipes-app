import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-600">
        Про нас
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="space-y-4">
          <p className="text-lg">
            <strong className="text-green-600">Recipefy</strong> — це проєкт для
            всіх, хто хоче навчитися готувати смачні страви або поділитися
            своїми рецептами. Тут ви можете не тільки переглядати рецепти, а й
            залишати відгуки, оцінки, зберігати улюблене та додавати свої власні
            кулінарні шедеври.
          </p>
          <p className="text-lg">
            Завантажуйте фото своїх страв, діліться секретами приготування та
            надихайте інших! Наш проєкт створений для навчання, обміну досвідом
            та натхнення.
          </p>
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            До головної
          </Link>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600 mb-2">
            Перегляд рецептів
          </h3>
          <p>
            Знаходьте сотні рецептів для будь-якого випадку, з фото та
            докладними інструкціями.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600 mb-2">
            Додавання своїх страв
          </h3>
          <p>
            Створюйте власні рецепти, додавайте фото та діліться своїми ідеями з
            іншими.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600 mb-2">
            Відгуки та оцінки
          </h3>
          <p>
            Коментуйте рецепти, залишайте відгуки та діліться враженнями про
            страви.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
