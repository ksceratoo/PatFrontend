const Background = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Light background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-purple-50/50 animate-pulse" />

      {/* Subtle moving elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.05),transparent_50%)] animate-pulse" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.05),transparent_50%)] animate-pulse"
        style={{ animationDelay: "1s" }}
      />
    </div>
  );
};

export default Background;
