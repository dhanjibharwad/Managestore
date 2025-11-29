 

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-white font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-lg">


        {/* Heading */}
        <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4 text-center">
          Welcome to Store Manager
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-lg mb-8">
          Manage your store inventory, customers, and orders all in one place.
          Get started by adding your products and organizing your workflow efficiently.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#products"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            View Products
          </a>
          <a
            href="#orders"
            className="px-6 py-3 border border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition"
          >
            View Orders
          </a>
        </div>
      </main>
    </div>
  );
}
