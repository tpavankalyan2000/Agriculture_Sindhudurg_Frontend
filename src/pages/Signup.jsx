import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSeedling } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    taluka: '',
    village: '',
    state: '',
    mobile: '',
    role: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const {
      name,
      email,
      password,
      confirmPassword,
      taluka,
      village,
      state,
      mobile,
      role,
    } = formData;

    if (
      !name || !email || !password || !confirmPassword ||
      !taluka || !village || !state || !mobile || !role
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // You can now call signup logic or API here
    console.log('Signup success', formData);
    navigate('/auth/login');
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <motion.div
        className="auth-card w-[60rem]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "1000px !important" }}

      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center bg-green-100 p-3 rounded-full mb-4"
              whileHover={{ rotate: 10 }}
            >
              <FaSeedling className="text-green-600 text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800">Signup</h1>
            <p className="text-gray-600 mt-2">Create your farming assistant account</p>
          </div>

          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          {/* Scrollable Form */}
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
            >
              {[
                { label: 'Name', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Mobile Number', name: 'mobile', type: 'tel' },
                { label: 'State', name: 'state', type: 'text' },
                { label: 'Taluka', name: 'taluka', type: 'text' },
                { label: 'Village', name: 'village', type: 'text' },
                { label: 'Role', name: 'role', type: 'text' },
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
              ].map(({ label, name, type }) => (
                <div className="flex flex-col" key={name}>
                  <label htmlFor={name} className="mb-1 font-medium text-gray-700">{label}</label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <motion.button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-md mt-2 hover:bg-green-700 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </motion.button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth/login')}
                className="text-green-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <div className="bg-green-600 text-white p-4 text-center text-sm rounded-b-lg">
          Empowering Farmers through AI-driven solutions
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
