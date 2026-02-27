import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const plans = await query(`
      SELECT p.*, 
        json_agg(json_build_object('name', COALESCE(f.name, ''), 'included', COALESCE(f.included, true))) as features
      FROM pricing_plans p
      LEFT JOIN plan_features f ON p.id = f.plan_id
      GROUP BY p.id
      ORDER BY p.price
    `);
    
    const normalizedPlans = plans.map((plan: any) => ({
      ...plan,
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price || 0,
      period: plan.period || '/month',
      button_text: plan.button_text || 'Get Started',
      button_style: plan.button_style || 'bg-slate-900 text-white hover:bg-slate-800',
      features: plan.features.filter((f: any) => f.name).map((f: any) => ({
        name: f.name || '',
        included: f.included !== false
      }))
    }));
    
    return NextResponse.json(normalizedPlans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [plan] = await query(
      `INSERT INTO pricing_plans (name, price, description, popular, period, button_text, button_style)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [body.name, body.price, body.description, body.popular, body.period || '/month', body.buttonText || 'Get Started', body.buttonStyle || 'bg-slate-900 text-white hover:bg-slate-800']
    );
    
    if (body.features?.length) {
      for (const feature of body.features) {
        await query(
          `INSERT INTO plan_features (plan_id, name, included) VALUES ($1, $2, $3)`,
          [plan.id, feature.name, feature.included]
        );
      }
    }
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const [plan] = await query(
      `UPDATE pricing_plans SET name=$1, price=$2, description=$3, popular=$4, period=$5, button_text=$6, button_style=$7, updated_at=CURRENT_TIMESTAMP
       WHERE id=$8 RETURNING *`,
      [body.name, body.price, body.description, body.popular, body.period, body.buttonText, body.buttonStyle, body.id]
    );
    
    await query(`DELETE FROM plan_features WHERE plan_id=$1`, [body.id]);
    if (body.features?.length) {
      for (const feature of body.features) {
        await query(
          `INSERT INTO plan_features (plan_id, name, included) VALUES ($1, $2, $3)`,
          [body.id, feature.name, feature.included]
        );
      }
    }
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await query(`DELETE FROM pricing_plans WHERE id=$1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}
