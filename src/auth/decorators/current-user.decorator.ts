import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from 'src/common/supabase/supabase.service';

export const CurrentUser = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const id: any = ctx.switchToHttp().getRequest()?.user?.id;
    if (!id) {
      return null;
    }
    const supabaseInstance = new SupabaseService(new ConfigService());
    return supabaseInstance
      .getClient()
      .from('users')
      .select()
      .eq('id', id)
      .single()
      ?.then(({ data }) => data);
  },
);
