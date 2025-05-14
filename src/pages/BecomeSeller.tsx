import React, { useState } from 'react';
import { Shield, Upload, AlertCircle } from 'lucide-react';

const BecomeSeller: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    discord: '',
    experience: '',
    items: '',
    why: '',
    portfolio: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, portfolio: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent">
              Become a Seller
            </h1>
            <p className="text-gray-300">
              Join our community of trusted sellers and start trading game passes and digital items.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-primary-main/20 p-8">
            <div className="flex items-center gap-3 mb-6 p-4 bg-primary-main/10 rounded-lg">
              <Shield className="text-primary-main" size={24} />
              <p className="text-gray-300">
                All applications are reviewed by our moderation team. We typically respond within 24-48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Roblox Username
                </label>
                <input
                  type="text"
                  required
                  className="input-primary"
                  placeholder="Enter your Roblox username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="input-primary"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discord Username
                </label>
                <input
                  type="text"
                  required
                  className="input-primary"
                  placeholder="Enter your Discord username"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trading Experience
                </label>
                <textarea
                  required
                  className="input-primary min-h-[100px]"
                  placeholder="Tell us about your trading experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Items You Plan to Sell
                </label>
                <textarea
                  required
                  className="input-primary min-h-[100px]"
                  placeholder="List the types of items you plan to sell"
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Why Do You Want to Become a Seller?
                </label>
                <textarea
                  required
                  className="input-primary min-h-[100px]"
                  placeholder="Tell us why you want to join our marketplace"
                  value={formData.why}
                  onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-primary-main/40 transition-colors duration-300">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary-main hover:text-primary-light focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-yellow-500">
                  By submitting this application, you agree to our terms of service and seller guidelines. 
                  We reserve the right to reject applications that don't meet our standards.
                </p>
              </div>

              <button type="submit" className="btn-primary w-full">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller; 