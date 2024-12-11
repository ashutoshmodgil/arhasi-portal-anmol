import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/login';
import useUserStore from '@/store/userStore';
import { toast } from '@/hooks/use-toast';

interface LoginResponse {
  access_token: string;
  user_id: string;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, setIsLoggedIn } = useUserStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => await login(data),
    onSuccess: (data: LoginResponse) => {
      console.log('success', data);
      setUser(data);
      setIsLoggedIn(true);
    },
    onError: (error) => {
      console.log('error', error);
      toast({
        title: 'Login failed',
        description: error.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    mutate(data);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-black'>
      <div className='w-full max-w-md p-8 space-y-8 rounded-xl shadow-lg border border-white'>
        <h2 className='text-2xl font-bold text-center text-white'>
          Login to Your Account
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='' className='text-white'>
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={!showPassword ? 'password' : 'text'}
                        placeholder='Enter your password'
                        {...field}
                      />
                      <div
                        className='absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500 cursor-pointer'
                        onClick={() => {
                          setShowPassword((showPassword) => !showPassword);
                        }}
                      >
                        {showPassword ? (
                          <Eye className='h-4 w-4' />
                        ) : (
                          <EyeOff className='h-4 w-4' />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Loading...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
