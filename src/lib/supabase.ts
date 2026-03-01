import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PlayerInfo {
    name: string;
    aadhaar: string;
}

export interface Registration {
    id?: string;
    created_at?: string;
    team_name: string;
    captain_name: string;
    captain_phone: string;
    player_names: string; // JSON stringified PlayerInfo[]
    payment_status: 'pending' | 'verified' | 'failed';
    utr_number?: string;
    amount: number;
}

// Get count of verified (registered) teams
export async function getVerifiedTeamCount(): Promise<number> {
    const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'verified');

    if (error) return 0;
    return count ?? 0;
}

// Get all pending+verified registrations count for capacity check
export async function getActiveTeamCount(): Promise<number> {
    const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .neq('payment_status', 'failed');

    if (error) return 0;
    return count ?? 0;
}

// Get verified teams for public display
export async function getVerifiedTeams(): Promise<{ team_name: string; captain_name: string }[]> {
    const { data, error } = await supabase
        .from('registrations')
        .select('team_name, captain_name')
        .eq('payment_status', 'verified')
        .order('created_at', { ascending: true });

    if (error) return [];
    return data ?? [];
}

// Get all registrations (for admin)
export async function getAllRegistrations(): Promise<Registration[]> {
    const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return [];
    return (data as Registration[]) ?? [];
}

// Check if any Aadhaar numbers are already registered
export async function checkAadhaarDuplicates(aadhaars: string[]): Promise<string[]> {
    const { data, error } = await supabase
        .from('registrations')
        .select('player_names')
        .neq('payment_status', 'failed');

    if (error) throw error;
    if (!data || data.length === 0) return [];

    const existingAadhaars = new Set<string>();
    for (const row of data) {
        try {
            const players: PlayerInfo[] = JSON.parse(row.player_names);
            for (const p of players) {
                existingAadhaars.add(p.aadhaar);
            }
        } catch {
            // skip
        }
    }

    return aadhaars.filter((a) => existingAadhaars.has(a));
}

// Insert a new registration
export async function createRegistration(data: Omit<Registration, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
        .from('registrations')
        .insert([data])
        .select()
        .single();

    if (error) throw error;
    return result;
}

// Update UTR
export async function updateUTR(id: string, utr: string) {
    const { data: result, error } = await supabase
        .from('registrations')
        .update({ utr_number: utr, payment_status: 'pending' as const })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return result;
}

// Verify payment (admin)
export async function verifyPayment(id: string) {
    const { data: result, error } = await supabase
        .from('registrations')
        .update({ payment_status: 'verified' as const })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return result;
}

// Reject payment (admin)
export async function rejectPayment(id: string) {
    const { data: result, error } = await supabase
        .from('registrations')
        .update({ payment_status: 'failed' as const })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return result;
}
