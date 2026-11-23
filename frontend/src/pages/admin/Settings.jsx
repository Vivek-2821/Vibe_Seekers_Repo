import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ShieldAlert, CreditCard, Phone, Mail, Instagram, Truck } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const StoreSettings = () => {
  const [settings, setSettings] = useState({
    codEnabled: 'false',
    returnsEnabled: 'false',
    upiId: '9860498749-2@ybl',
    upiPayeeName: 'Vivek Ashok Matne',
    supportPhone: '+91 9860498749',
    storeEmail: 'vibeseekers09@gmail.com',
    instagramUrl: 'https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr',
  });

  const [shippingSettings, setShippingSettings] = useState({
    shippingEnabled: false,
    shippingAmount: 79,
  });
  const [savingShipping, setSavingShipping] = useState(false);

  const [savingKey, setSavingKey] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, shippingRes] = await Promise.allSettled([
          axiosInstance.get('/api/admin/settings'),
          axiosInstance.get('/api/settings/shipping'),
        ]);

        if (settingsRes.status === 'fulfilled' && settingsRes.value.data?.data) {
          setSettings((prev) => ({ ...prev, ...settingsRes.value.data.data }));
        }

        if (shippingRes.status === 'fulfilled') {
          const sData = shippingRes.value.data?.data || shippingRes.value.data;
          if (sData) {
            setShippingSettings({
              shippingEnabled: !!sData.shippingEnabled,
              shippingAmount: Number(sData.shippingAmount) || 79,
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch store settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveShipping = async () => {
    setSavingShipping(true);
    try {
      const res = await axiosInstance.put('/api/admin/settings/shipping', {
        shippingEnabled: !!shippingSettings.shippingEnabled,
        shippingAmount: Number(shippingSettings.shippingAmount) || 0,
      });
      const updated = res.data?.data || res.data;
      if (updated) {
        setShippingSettings({
          shippingEnabled: !!updated.shippingEnabled,
          shippingAmount: Number(updated.shippingAmount) || 0,
        });
      }
      setSuccessToast('Shipping charges configuration saved successfully.');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert('Failed to save shipping settings');
    } finally {
      setSavingShipping(false);
    }
  };

  const saveSingleSetting = async (key, value, description) => {
    setSavingKey(key);
    try {
      await axiosInstance.put('/api/admin/settings', {
        settingKey: key,
        settingValue: String(value),
        description,
      });
      setSettings((prev) => ({ ...prev, [key]: String(value) }));
      setSuccessToast(`Setting "${key}" updated successfully.`);
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert('Failed to update setting');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
          Global Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
          Store Settings & Policy Toggles
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Adjust payment rules, return policies, and public customer support contact details.
        </p>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Shipping Charges Configuration Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Truck size={18} className="text-vibe-accent" />
            <span>Shipping Charges Configuration</span>
          </h2>
          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
            shippingSettings.shippingEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-zinc-800 text-zinc-400'
          }`}>
            {shippingSettings.shippingEnabled ? 'SHIPPING CHARGE ACTIVE' : 'FREE SHIPPING ACTIVE'}
          </span>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
          <div>
            <h3 className="text-xs font-bold uppercase text-white">Enable Shipping Charges</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              When ON, buyers are charged the configured shipping amount at checkout. When OFF, shipping displays as FREE (₹0).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShippingSettings(prev => ({ ...prev, shippingEnabled: !prev.shippingEnabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              shippingSettings.shippingEnabled ? 'bg-emerald-600' : 'bg-zinc-800'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                shippingSettings.shippingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Shipping Amount Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Standard Shipping Fee (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
              <input
                type="number"
                min="0"
                step="1"
                disabled={!shippingSettings.shippingEnabled}
                value={shippingSettings.shippingAmount}
                onChange={(e) => setShippingSettings({ ...shippingSettings, shippingAmount: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent font-mono disabled:opacity-50"
                placeholder="79"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Default standard pan-India courier delivery charge (e.g. ₹79).
            </p>
          </div>

          <div className="flex justify-start sm:justify-end">
            <button
              type="button"
              disabled={savingShipping}
              onClick={handleSaveShipping}
              className="px-6 py-2.5 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Save size={14} />
              <span>{savingShipping ? 'Saving...' : 'Save Shipping Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggles Card (COD & Returns) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
          <ShieldAlert size={18} className="text-vibe-accent" />
          <span>Storefront Policy Toggles</span>
        </h2>

        {/* Returns Enabled Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-zinc-800/80">
          <div>
            <h3 className="text-xs font-bold uppercase text-white">Enable Customer Returns</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Current state: <strong className={settings.returnsEnabled === 'true' ? 'text-emerald-400' : 'text-amber-400'}>
                {settings.returnsEnabled === 'true' ? 'RETURNS ENABLED' : 'RETURNS DISABLED (Default)'}
              </strong>.
            </p>
          </div>
          <button
            onClick={() =>
              saveSingleSetting(
                'returnsEnabled',
                settings.returnsEnabled === 'true' ? 'false' : 'true',
                'Toggle return requests on customer storefront'
              )
            }
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              settings.returnsEnabled === 'true'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {settings.returnsEnabled === 'true' ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* COD Enabled Toggle */}
        <div className="flex items-center justify-between py-3">
          <div>
            <h3 className="text-xs font-bold uppercase text-white">Enable Cash on Delivery (COD)</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Current state: <strong className={settings.codEnabled === 'true' ? 'text-emerald-400' : 'text-red-400'}>
                {settings.codEnabled === 'true' ? 'COD ENABLED' : 'COD DISABLED (Prepaid Only)'}
              </strong>.
            </p>
          </div>
          <button
            onClick={() =>
              saveSingleSetting(
                'codEnabled',
                settings.codEnabled === 'true' ? 'false' : 'true',
                'Toggle Cash on Delivery availability at checkout'
              )
            }
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              settings.codEnabled === 'true'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {settings.codEnabled === 'true' ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Official UPI Details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
          <CreditCard size={18} className="text-vibe-accent" />
          <span>Prepaid UPI Configuration</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Store UPI ID *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent font-mono"
              />
              <button
                onClick={() => saveSingleSetting('upiId', settings.upiId, 'Store UPI ID')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-lg"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Payee Name (Displayed under QR) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.upiPayeeName}
                onChange={(e) => setSettings({ ...settings, upiPayeeName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
              <button
                onClick={() => saveSingleSetting('upiPayeeName', settings.upiPayeeName, 'Payee Legal Name')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support Channels */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
          <Phone size={18} className="text-vibe-accent" />
          <span>Support Contact Details</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Customer Support & WhatsApp Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
              <button
                onClick={() => saveSingleSetting('supportPhone', settings.supportPhone, 'Support Phone')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-lg"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Official Store Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
              <button
                onClick={() => saveSingleSetting('storeEmail', settings.storeEmail, 'Support Email')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-lg"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Instagram Profile URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
              <button
                onClick={() => saveSingleSetting('instagramUrl', settings.instagramUrl, 'Instagram URL')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
