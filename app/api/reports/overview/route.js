import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// GET /api/reports/overview - Aggregated stats for dashboard charts
export async function GET(request) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let query = { isActive: true };
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo)   query.createdAt.$lte = new Date(dateTo);
    }

    // 1. Status distribution
    const statusStats = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 2. Category distribution with resolution tracking
    const categoryStats = await Complaint.aggregate([
      { $match: query },
      { $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } }
      } }
    ]);

    // 3. Department distribution
    const deptStats = await Complaint.aggregate([
        { $match: query },
        { $group: { 
            _id: '$department', 
            total: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } }
        }}
    ]);

    // 4. Monthly trend (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyTrend = await Complaint.aggregate([
        { $match: { 
            createdAt: { $gte: sixMonthsAgo },
            isActive: true
        }},
        { $group: {
            _id: { 
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
            },
            total: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } }
        }},
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        status: statusStats.map(s => ({ name: s._id, value: s.count })),
        category: categoryStats.map(c => ({ name: c._id, count: c.count, resolved: c.resolved })),
        departments: deptStats.map(d => ({ dept: d._id || 'Unassigned', total: d.total, resolved: d.resolved })),
        trend: monthlyTrend.map(m => ({
            month: new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'short' }),
            year: m._id.year,
            total: m.total,
            resolved: m.resolved
        }))
      }
    });
  } catch (error) {
    console.error('Reports overview error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report overview' },
      { status: 500 }
    );
  }
}
