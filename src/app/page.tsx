import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Reuser</h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage test user accounts for your staging environments
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Stop the chaos of shared test accounts. Reuser lets your team easily
            add, remove, checkout, and manage test user accounts so everyone
            knows which accounts are available and who's using them.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Create Organization
                </h3>
                <p className="text-gray-600 text-sm">
                  Set up your team's organization with just a company name
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Add Test Users
                </h3>
                <p className="text-gray-600 text-sm">
                  Create test user accounts with names, emails, and passwords
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Checkout & Manage
                </h3>
                <p className="text-gray-600 text-sm">
                  Checkout users when testing, see who's using what
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/create-organization"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Create Your Organization
          </Link>
        </div>
      </div>
    </div>
  );
}
