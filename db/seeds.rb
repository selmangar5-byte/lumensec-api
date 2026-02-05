puts "🌱 Seeding database..."

tenant = Tenant.find_or_create_by!(id: 1) do |t|
  t.name = "Demo Tenant"
end

puts "✅ Tenant ready: #{tenant.name}"
