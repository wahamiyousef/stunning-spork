  import React, { useState } from 'react';
  import { createClient } from '@supabase/supabase-js';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async () => {
      if (isSignUp) {
        const { data, error } = await supabase.from('users').insert([{ email, password }]);
        console.log(data);
        if (error) alert(error.message);
        else alert('Account created successfully!');
      } else {
        const { data: users, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password);
        if (error) alert(error.message);
        else if (users.length > 0) alert('Signed in successfully!');
        else alert('Invalid credentials');
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-400 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Concert Tracker Auth</h1>
        <div className="flex flex-col bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleAuth} className="w-full bg-blue-600 text-white font-semibold rounded-xl py-2 hover:bg-blue-700">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Button>
        </div>
      </div>
    );
  }
