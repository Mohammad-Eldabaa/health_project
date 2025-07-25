import React from "react";
export function StatsCards({
    stats }) {


    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8  ">
        {stats.map((stat, index) => <div key={index} className="bg-gray-100 rounded-xl shadow p-6 flex items-center justify-between ">
            <div>
                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-bold text-gray-800">
                        {stat.value}
                    </span>
                    <span className="text-green-600 text-sm">{stat.change}</span>
                </div>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">{stat.icon}</div>
        </div>)}
    </div>;
}
