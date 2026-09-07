import { createClient } from '@supabase/supabase-js'

// .env에 저장한 Supabase 프로젝트 주소를 가져온다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// .env에 저장한 Supabase 공개 키를 가져온다.
const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 여러 컴포넌트에서 사용할 Supabase 연결 객체를 생성한다.
export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
)