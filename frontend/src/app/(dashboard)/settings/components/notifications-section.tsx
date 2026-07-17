'use client';

import { useActionState } from 'react';
import { Bell } from 'lucide-react';
import { updateNotifications } from '../actions';
import { SubmitButton } from './submit-button';
import { FormMessage } from './form-message';

const items = [
  {
    id: 'email_marketing',
    label: 'Marketing emails',
    desc: 'Receive emails about new features and promotions.',
    defaultChecked: false,
  },
  {
    id: 'email_security',
    label: 'Security alerts',
    desc: 'Get notified about suspicious activity and security updates.',
    defaultChecked: true,
  },
  {
    id: 'email_updates',
    label: 'Product updates',
    desc: 'Receive updates about product changes and improvements.',
    defaultChecked: true,
  },
  {
    id: 'push_enabled',
    label: 'Push notifications',
    desc: 'Receive push notifications in your browser.',
    defaultChecked: false,
  },
];

export function NotificationsSection() {
  const [state, formAction] = useActionState(
    async (_prevState: unknown, formData: FormData) => updateNotifications(formData),
    null
  );

  return (
    <section
      id="notifications"
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden scroll-mt-6"
    >
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500">Choose how you want to be notified.</p>
        </div>
      </div>

      <form action={formAction} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name={item.id}
                  defaultChecked={item.defaultChecked}
                  className="peer h-5 w-5 rounded-md border-2 border-slate-300 text-amber-600 
                    focus:ring-amber-500/20 focus:ring-offset-0 
                    checked:border-amber-500 checked:bg-amber-500
                    transition-all cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 group-hover:text-slate-950 transition-colors">
                  {item.label}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 gap-3">
          <FormMessage state={state} />
          <SubmitButton className="text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/10">
            Save Preferences
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}