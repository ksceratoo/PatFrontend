const DocumentationNav = ({
  categories,
  activeTab,
  setActiveTab,
}: {
  categories: { label: string; value: string }[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}) => {
  return (
    <div
      className="w-64 mx-5 min-h-screen  
        rounded-lg mt-2 bg-white p-4 border border-gray-200 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Documentation
      </h3>
      {categories.map((category) => (
        <button
          key={category.value}
          className={`w-full py-3 px-4 rounded-lg 
                my-1 shadow-sm border border-gray-200
                text-left font-medium transition-all duration-300 text-sm 
                ${
                  activeTab === category.value
                    ? "bg-blue-600 text-white shadow-md border-blue-600 transform scale-105"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                }`}
          onClick={() => setActiveTab(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default DocumentationNav;
