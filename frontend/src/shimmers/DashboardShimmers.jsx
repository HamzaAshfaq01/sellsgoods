import React from "react";

const DashboardShimmers = () => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 animate-pulse">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {[
                            "Order ID",
                            "Customer Name",
                            "Email",
                            "Area",
                            "Phone #",
                            "Status",
                            "Created At",
                            "Actions",
                        ].map((heading, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(15)].map((_, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-gray-50">
                            {Array(8).fill().map((_, colIdx) => (
                                <td key={colIdx} className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardShimmers;
