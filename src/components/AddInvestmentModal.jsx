import { useState, useEffect } from 'react';

const AddInvestmentModal = ({ isOpen, onClose, onSubmit, sections, defaultSection }) => {
  const [form, setForm] = useState({
    section: defaultSection || '80C',
    name: '',
    amount: ''
  });

  // Update section when defaultSection changes
  useEffect(() => {
    if (defaultSection) {
      setForm(prev => ({ ...prev, section: defaultSection }));
    }
  }, [defaultSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(form.amount);
    if (!form.name || !amountNum || amountNum <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }
    onSubmit({ section: form.section, name: form.name, amount: amountNum });
    // Reset form after submission
    setForm({ section: defaultSection || '80C', name: '', amount: '' });
  };

  const handleClose = () => {
    // Reset form when closing
    setForm({ section: defaultSection || '80C', name: '', amount: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-800">
        <h3 className="text-2xl font-bold mb-6 text-white heading-font">Add Investment</h3>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Section</label>
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full input-dark rounded-xl px-4 py-3"
            >
              {sections.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., ELSS, PPF, NPS"
              className="w-full input-dark rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Amount (₹)</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="50000"
              className="w-full input-dark rounded-xl px-4 py-3"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={handleClose} 
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-all font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="gradient-button"
            >
              Add Investment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvestmentModal;
