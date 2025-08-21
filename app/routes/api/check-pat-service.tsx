// Alternative: Use external Pat type checking service
// This could call a dedicated server with mbcheck installed

export async function action({ request }: any) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json(
        {
          success: false,
          error: "Invalid Pat code provided",
        },
        { status: 400 }
      );
    }

    // Option 1: Call external service (if you have one)
    const externalServiceUrl = process.env.PAT_TYPECHECK_SERVICE_URL;

    if (externalServiceUrl) {
      try {
        const response = await fetch(`${externalServiceUrl}/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          timeout: 30000, // 30 second timeout
        });

        if (response.ok) {
          const result = await response.json();
          return Response.json({
            ...result,
            source: "external-service",
          });
        }
      } catch (error) {
        console.warn("External service failed, using fallback:", error);
      }
    }

    // Option 2: Use simplified checker as fallback
    const { runSimplifiedTypeChecker } = await import("./check-pat-simple");
    const result = await runSimplifiedTypeChecker(code);

    return Response.json({
      ...result,
      source: "simplified-fallback",
    });
  } catch (error: any) {
    console.error("API error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
