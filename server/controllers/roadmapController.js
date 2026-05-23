const Field = require('../models/Field');
const Track = require('../models/Track');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

exports.getAllFieldsWithRoadmaps = async (req, res) => {
  try {
    const fields = await Field.find({ isActive: true }).sort({ order: 1 });
    const tracks = await Track.find({ isActive: true }).sort({ order: 1 });

    const fieldsWithTracks = fields.map(field => {
      const fieldTracks = tracks.filter(t => t.fieldId.toString() === field._id.toString());
      return {
        ...field.toObject(),
        tracks: fieldTracks
      };
    });

    res.json(fieldsWithTracks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFieldRoadmap = async (req, res) => {
  try {
    const field = await Field.findById(req.params.fieldId);
    if (!field) return res.status(404).json({ message: 'Field not found' });

    const tracks = await Track.find({ fieldId: field._id, isActive: true }).sort({ order: 1 });
    const courses = await Course.find({ fieldId: field._id }).populate('trackId');

    const user = await User.findById(req.user.id);
    const hasActiveEnrollment = !!user.activeCourse;

    const tracksWithProgress = await Promise.all(tracks.map(async (track) => {
      const trackCourses = courses.filter(c => c.trackId?._id?.toString() === track._id.toString());

      const coursesWithProgress = await Promise.all(trackCourses.map(async (course) => {
        const allLectures = await Lecture.find({ courseId: course._id });
        const completedLectures = await UserProgress.find({
          userId: req.user.id, courseId: course._id, isCompleted: true
        });
        return {
          ...course.toObject(),
          totalLectures: allLectures.length,
          completedLectures: completedLectures.length,
          percent: allLectures.length > 0 ? Math.round((completedLectures.length / allLectures.length) * 100) : 0,
          status: completedLectures.length === 0 ? 'not-started'
            : completedLectures.length >= allLectures.length ? 'completed' : 'in-progress'
        };
      }));

      const trackCompleted = coursesWithProgress.every(c => c.status === 'completed');
      const trackInProgress = coursesWithProgress.some(c => c.status === 'in-progress' || c.status === 'completed');

      return {
        ...track.toObject(),
        courses: coursesWithProgress,
        totalCourses: trackCourses.length,
        completedCourses: coursesWithProgress.filter(c => c.status === 'completed').length,
        progress: trackCompleted ? 100 : trackInProgress ? 50 : 0,
        isLocked: hasActiveEnrollment && user.activeTrack?.toString() !== track._id.toString()
      };
    }));

    res.json({
      field,
      tracks: tracksWithProgress,
      hasActiveEnrollment,
      activeTrackId: user.activeTrack
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCareerPaths = async (req, res) => {
  try {
    const fields = await Field.find({ isActive: true }, {
      name: 1, icon: 1, color: 1, description: 1, careerPaths: 1,
      subFields: 1, technologies: 1, difficulty: 1, totalDuration: 1, overview: 1
    }).sort({ order: 1 });

    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubFieldRoadmap = async (req, res) => {
  try {
    const { fieldId, subFieldName } = req.params;
    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ message: 'Field not found' });

    const subField = field.subFields.find(
      sf => sf.name.toLowerCase().replace(/\s+/g, '-') === subFieldName.toLowerCase()
    );
    if (!subField) return res.status(404).json({ message: 'Sub-field not found' });

    const tracks = await Track.find({
      fieldId: field._id,
      name: { $regex: subField.name, $options: 'i' }
    }).sort({ order: 1 });

    const allTracks = tracks.length > 0 ? tracks : await Track.find({ fieldId: field._id }).sort({ order: 1 });

    res.json({
      field: { _id: field._id, name: field.name, icon: field.icon, color: field.color },
      subField,
      tracks: allTracks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTrackRoadmap = async (req, res) => {
  try {
    const track = await Track.findById(req.params.trackId).populate('fieldId', 'name icon color');
    if (!track) return res.status(404).json({ message: 'Track not found' });

    const user = await User.findById(req.user.id);
    const isActiveTrack = user.activeTrack?.toString() === track._id.toString();
    const isLocked = user.activeCourse && !isActiveTrack;

    const courses = await Course.find({ trackId: track._id }).sort({ order: 1 });

    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
      const allLectures = await Lecture.find({ courseId: course._id });
      const completedLectures = await UserProgress.find({
        userId: req.user.id, courseId: course._id, isCompleted: true
      });
      return {
        ...course.toObject(),
        totalLectures: allLectures.length,
        completedLectures: completedLectures.length,
        percent: allLectures.length > 0 ? Math.round((completedLectures.length / allLectures.length) * 100) : 0,
        status: completedLectures.length === 0 ? 'not-started'
          : completedLectures.length >= allLectures.length ? 'completed' : 'in-progress',
        isLocked: isLocked && !isActiveTrack
      };
    }));

    res.json({
      track: track.toObject(),
      courses: coursesWithProgress,
      isActiveTrack,
      isLocked,
      hasActiveCourse: !!user.activeCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
