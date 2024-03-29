export const createPlan = async (plan) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
    }
  };
  