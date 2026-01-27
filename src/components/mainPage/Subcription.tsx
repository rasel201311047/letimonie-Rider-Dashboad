import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  DollarSign,
  Download,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  CreditCard,
  Clock,
} from "lucide-react";

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  status: "active" | "inactive";
  subscribers: number;
}

interface SubscriptionCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  status: "active" | "pending" | "cancelled";
  startDate: string;
  endDate: string;
  paymentMethod: string;
}

const Subscription = () => {
  const [activeTab, setActiveTab] = useState<"plans" | "customers">("plans");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for subscription plans
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([
    {
      id: "1",
      name: "Basic Plan",
      price: 9.99,
      duration: "monthly",
      features: ["10GB Storage", "Basic Support", "Up to 5 Users"],
      status: "active",
      subscribers: 150,
    },
    {
      id: "2",
      name: "Pro Plan",
      price: 29.99,
      duration: "monthly",
      features: [
        "50GB Storage",
        "Priority Support",
        "Up to 25 Users",
        "Advanced Analytics",
      ],
      status: "active",
      subscribers: 85,
    },
    {
      id: "3",
      name: "Enterprise Plan",
      price: 99.99,
      duration: "monthly",
      features: [
        "Unlimited Storage",
        "24/7 Support",
        "Unlimited Users",
        "Advanced Analytics",
        "Custom Integration",
      ],
      status: "inactive",
      subscribers: 25,
    },
    {
      id: "4",
      name: "Annual Basic",
      price: 99.99,
      duration: "yearly",
      features: ["15GB Storage", "Basic Support", "Up to 8 Users"],
      status: "active",
      subscribers: 42,
    },
  ]);

  // Mock data for customers
  const [customers] = useState<SubscriptionCustomer[]>([
    {
      id: "101",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      plan: "Pro Plan",
      amount: 29.99,
      status: "active",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      paymentMethod: "Cash",
    },
    {
      id: "102",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      plan: "Basic Plan",
      amount: 9.99,
      status: "active",
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      paymentMethod: "Cash",
    },
    {
      id: "103",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "+1 (555) 456-7890",
      plan: "Enterprise Plan",
      amount: 99.99,
      status: "pending",
      startDate: "2024-03-10",
      endDate: "2025-03-10",
      paymentMethod: "Cash",
    },
    {
      id: "104",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+1 (555) 789-0123",
      plan: "Annual Basic",
      amount: 99.99,
      status: "cancelled",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      paymentMethod: "Cash",
    },
  ]);

  // Calculate stats
  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.amount,
    0,
  );
  const activeSubscribers = customers.filter(
    (c) => c.status === "active",
  ).length;
  const activePlans = subscriptionPlans.filter(
    (p) => p.status === "active",
  ).length;

  // Handle plan deletion
  const handleDeletePlan = (planId: string) => {
    setSubscriptionPlans((plans) => plans.filter((plan) => plan.id !== planId));
    setShowDeleteModal(false);
    setSelectedPlan(null);
  };

  // Toggle plan status
  const togglePlanStatus = (planId: string) => {
    setSubscriptionPlans((plans) =>
      plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              status: plan.status === "active" ? "inactive" : "active",
            }
          : plan,
      ),
    );
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Subscription Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage subscription plans and customer subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="bg-white rounded-xl shadow p-6 border-l-4"
          style={{ borderLeftColor: "#053F53" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">
                ${totalRevenue.toFixed(2)}
              </h3>
            </div>
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "#053F5310" }}
            >
              <DollarSign className="w-6 h-6" style={{ color: "#053F53" }} />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl shadow p-6 border-l-4"
          style={{ borderLeftColor: "#053F53" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Subscribers</p>
              <h3 className="text-2xl font-bold mt-1">{activeSubscribers}</h3>
            </div>
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "#053F5310" }}
            >
              <Users className="w-6 h-6" style={{ color: "#053F53" }} />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl shadow p-6 border-l-4"
          style={{ borderLeftColor: "#053F53" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Plans</p>
              <h3 className="text-2xl font-bold mt-1">{activePlans}</h3>
            </div>
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "#053F5310" }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: "#053F53" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Action Buttons */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "plans"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  backgroundColor:
                    activeTab === "plans" ? "#053F53" : "transparent",
                }}
                onClick={() => setActiveTab("plans")}
              >
                Subscription Plans
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "customers"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  backgroundColor:
                    activeTab === "customers" ? "#053F53" : "transparent",
                }}
                onClick={() => setActiveTab("customers")}
              >
                Subscribers ({customers.length})
              </button>
            </div>

            {activeTab === "plans" ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: "#053F53" }}
              >
                <Plus className="w-4 h-4" />
                Add New Plan
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "plans" ? (
            // Plans Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="p-4 text-white"
                    style={{ backgroundColor: "#053F53" }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="opacity-90">{plan.duration}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePlanStatus(plan.id)}
                          className={`p-1 rounded-full ${
                            plan.status === "active"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        >
                          {plan.status === "active" ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            // Handle edit - would open edit modal in real app
                          }}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-bold">
                        ${plan.price.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="w-4 h-4" />
                        <span>{plan.subscribers} subscribers</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <h4 className="font-semibold mb-3 text-gray-700">
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            plan.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {plan.status === "active" ? "Active" : "Inactive"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 text-sm">
                          Last updated: 2 days ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Customers Table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Subscription Plan
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Start Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#053F5310" }}
                          >
                            <User
                              style={{ color: "#053F53" }}
                              className="w-5 h-5"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{customer.plan}</div>
                        <div className="text-sm text-gray-500">
                          ID: {customer.id}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-lg">
                          ${customer.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Monthly</div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.status === "active"
                              ? "bg-green-100 text-green-800"
                              : customer.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {customer.status.charAt(0).toUpperCase() +
                            customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{customer.startDate}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          Ends {customer.endDate}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span>{customer.paymentMethod}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Add New Subscription Plan
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    placeholder="e.g., Premium Plan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (one per line)
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    rows={4}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white font-medium rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: "#053F53" }}
                onClick={() => setShowAddModal(false)}
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Delete Plan</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete the{" "}
                <strong>"{selectedPlan.name}"</strong> plan? This action cannot
                be undone.
              </p>
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-red-600 text-sm">
                  <strong>Warning:</strong> This plan has{" "}
                  {selectedPlan.subscribers} active subscribers. They will need
                  to choose a new plan.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPlan(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlan(selectedPlan.id)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
